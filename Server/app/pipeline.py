import re
from collections.abc import Callable
from typing import Any

from app.agents.SearchAgent import build_search_agent
from app.agents.ReaderAgent import build_reader_agent
from app.chains.chain import build_writer_chain, build_critic_chain
from app.llm.gemini import get_gemini_llm
from app.llm.mistral import get_mistral_llm

ProgressCallback = Callable[[dict[str, Any]], None]
URL_PATTERN = re.compile(r"https?://[^\s<>)\]}]+")

def _emit(callback: ProgressCallback | None, stage: str, status: str, message: str) -> None:
    if callback:
        callback({"type": "stage", "stage": stage, "status": status, "message": message})

def _emit_sources(callback: ProgressCallback | None, sources: list[str]) -> None:
    if callback:
        callback({"type": "sources", "sources": sources})

def _emit_model(
    callback: ProgressCallback | None,
    provider: str,
    fallback: bool,
    stage: str | None = None,
    message: str | None = None,
) -> None:
    if callback:
        event: dict[str, Any] = {
            "type": "model",
            "provider": provider,
            "fallback": fallback,
        }
        if stage:
            event["stage"] = stage
        if message:
            event["message"] = message
        callback(event)

def _message_content(message: Any) -> str:
    content = getattr(message, "content", "")
    if isinstance(content, str):
        return content
    return str(content) if content is not None else ""

def _agent_has_output(response: Any) -> bool:
    if not isinstance(response, dict):
        return bool(str(response).strip())

    for message in response.get("messages", []):
        if _message_content(message).strip():
            return True
    return False

def _text_has_output(response: Any) -> bool:
    return bool(str(response).strip())

def _extract_urls(text: str) -> list[str]:
    sources: list[str] = []
    for url in URL_PATTERN.findall(text or ""):
        cleaned = url.rstrip(".,;:\"'")
        if cleaned not in sources:
            sources.append(cleaned)
    return sources

def _provider_model(provider: str):
    if provider == "Mistral":
        return get_mistral_llm()
    return get_gemini_llm()

def _run_stage(
    stage: str,
    active_provider: str,
    runner: Callable[[Any], Any],
    validator: Callable[[Any], bool],
    on_progress: ProgressCallback | None,
) -> tuple[Any, str, bool]:
    try:
        result = runner(_provider_model(active_provider))
        if not validator(result):
            raise RuntimeError(f"{active_provider} returned an empty response.")
        return result, active_provider, False
    except Exception as primary_error:
        if active_provider == "Mistral":
            raise RuntimeError(
                f"Mistral failed during {stage}: {primary_error}"
            ) from primary_error

        _emit(
            on_progress,
            stage,
            "running",
            "Gemini failed. Switching this run to Mistral.",
        )
        _emit_model(
            on_progress,
            "Mistral",
            True,
            stage,
            "Gemini failed, so DeepScout switched to Mistral for the rest of this run.",
        )

        try:
            result = runner(_provider_model("Mistral"))
            if not validator(result):
                raise RuntimeError("Mistral returned an empty response.")
            return result, "Mistral", True
        except Exception as fallback_error:
            raise RuntimeError(
                f"Both Gemini and Mistral failed during {stage}. "
                f"Gemini: {primary_error}. Mistral: {fallback_error}"
            ) from fallback_error

def run_research_pipeline(
    query: str,
    on_progress: ProgressCallback | None = None,
) -> dict[str, Any]:
    query = query.strip()
    if not query:
        raise ValueError("Research query cannot be empty.")

    state: dict[str, Any] = {
        "query": query,
        "active_provider": "Gemini",
        "fallback_triggered": False,
        "models_used": {},
    }
    active_provider = "Gemini"
    _emit_model(on_progress, "Gemini", False, message="Gemini is the primary model.")

    _emit(on_progress, "search", "running", "Searching for recent, reliable sources")
    search_response, active_provider, switched = _run_stage(
        "search",
        active_provider,
        lambda model: build_search_agent(model).invoke({
            "messages": [
                (
                    "user",
                    f"Find recent, reliable, and relevant information about {query}. "
                    "Use web search and preserve the source URLs.",
                )
            ]
        }),
        _agent_has_output,
        on_progress,
    )
    state["models_used"]["search"] = active_provider
    state["fallback_triggered"] = state["fallback_triggered"] or switched
    state["active_provider"] = active_provider

    messages = search_response.get("messages", [])
    tool_contents: list[str] = []
    all_contents: list[str] = []

    for message in messages:
        content = _message_content(message)
        if content:
            all_contents.append(content)

        message_type = getattr(message, "type", "")
        if message_type == "tool" or message.__class__.__name__ == "ToolMessage":
            if content:
                tool_contents.append(content)

    final_search_answer = _message_content(messages[-1]) if messages else ""
    raw_search_results = "\n\n".join(tool_contents).strip()

    state["search_results"] = raw_search_results or final_search_answer
    state["sources"] = _extract_urls(raw_search_results)
    if not state["sources"]:
        state["sources"] = _extract_urls("\n".join(all_contents))

    _emit(on_progress, "search", "complete", f"Found {len(state['sources'])} source links")
    _emit_sources(on_progress, state["sources"])

    _emit(on_progress, "reader", "running", "Opening and reading the strongest source")
    reader_response, active_provider, switched = _run_stage(
        "reader",
        active_provider,
        lambda model: build_reader_agent(model).invoke({
            "messages": [
                (
                    "user",
                    f"Based on the following search results about '{query}', "
                    "pick the most relevant URL and scrape it for deeper content.\n\n"
                    f"Search Results:\n{state['search_results']}",
                )
            ]
        }),
        _agent_has_output,
        on_progress,
    )
    state["models_used"]["reader"] = active_provider
    state["fallback_triggered"] = state["fallback_triggered"] or switched
    state["active_provider"] = active_provider

    reader_messages = reader_response.get("messages", [])
    state["scraped_content"] = _message_content(reader_messages[-1]) if reader_messages else ""
    _emit(on_progress, "reader", "complete", "Primary source inspected")

    research_combined = (
        f"Search Results:\n{state['search_results']}\n\n"
        f"Scraped Content:\n{state['scraped_content']}"
    )

    _emit(on_progress, "writer", "running", "Synthesizing evidence into a research report")
    writer_result, active_provider, switched = _run_stage(
        "writer",
        active_provider,
        lambda model: build_writer_chain(model).invoke({
            "topic": query,
            "research": research_combined,
        }),
        _text_has_output,
        on_progress,
    )
    state["models_used"]["writer"] = active_provider
    state["fallback_triggered"] = state["fallback_triggered"] or switched
    state["active_provider"] = active_provider
    state["research_report"] = writer_result
    _emit(on_progress, "writer", "complete", "Research report drafted")

    _emit(on_progress, "critic", "running", "Reviewing the report for gaps and weaknesses")
    critic_result, active_provider, switched = _run_stage(
        "critic",
        active_provider,
        lambda model: build_critic_chain(model).invoke({
            "report": state["research_report"],
        }),
        _text_has_output,
        on_progress,
    )
    state["models_used"]["critic"] = active_provider
    state["fallback_triggered"] = state["fallback_triggered"] or switched
    state["active_provider"] = active_provider
    state["critic_feedback"] = critic_result
    _emit(on_progress, "critic", "complete", "Independent critique complete")

    return state
