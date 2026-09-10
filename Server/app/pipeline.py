from collections.abc import Callable
from typing import Any

from app.agents.SearchAgent import build_search_agent
from app.agents.ReaderAgent import build_reader_agent
from app.chains.chain import writer_chain, critic_chain

ProgressCallback = Callable[[dict[str, Any]], None]


def _emit(callback: ProgressCallback | None, stage: str, status: str, message: str) -> None:
    if callback:
        callback({"type": "stage", "stage": stage, "status": status, "message": message})


def run_research_pipeline(query: str, on_progress: ProgressCallback | None = None) -> dict:
    state = {}

    _emit(on_progress, "search", "running", "Searching for recent, reliable sources")
    search_agent = build_search_agent()
    search_results = search_agent.invoke({
        "messages": [("user", f"Find recent, reliable, and relevant information about {query}.")]
    })
    state["search_results"] = search_results["messages"][-1].content
    _emit(on_progress, "search", "complete", "Relevant web evidence discovered")

    _emit(on_progress, "reader", "running", "Opening and reading the strongest source")
    reader_agent = build_reader_agent()
    reader_results = reader_agent.invoke({
        "messages": [("user",
            f"Based on the following search results about '{query}', "
            f"pick the most relevant URL and scrape it in deeper content.\n\n"
            f"Search Results:\n{state['search_results'][:800]}"
        )]
    })
    state["scraped_content"] = reader_results["messages"][-1].content
    _emit(on_progress, "reader", "complete", "Primary source inspected")

    research_combined = (
        f"Search Results:\n{state['search_results']}\n\n"
        f"Scraped Content:\n{state['scraped_content']}"
    )

    _emit(on_progress, "writer", "running", "Synthesizing evidence into a research report")
    writer_results = writer_chain.invoke({
        "topic": query,
        "research": research_combined,
    })
    state["research_report"] = writer_results
    _emit(on_progress, "writer", "complete", "Research report drafted")

    _emit(on_progress, "critic", "running", "Reviewing the report for gaps and weaknesses")
    critic_results = critic_chain.invoke({
        "report": state["research_report"],
    })
    state["critic_feedback"] = critic_results
    _emit(on_progress, "critic", "complete", "Independent critique complete")

    return state


if __name__ == "__main__":
    query = "The impact of climate change on global agriculture"
    results = run_research_pipeline(query)
    print("Research Report:\n", results["research_report"])
    print("\nCritic Feedback:\n", results["critic_feedback"])
