import asyncio
import json
import queue
import re
import threading
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from starlette.concurrency import run_in_threadpool

from app.pipeline import run_research_pipeline

app = FastAPI(
    title="DeepScout API",
    description="API layer for the DeepScout multi-agent research pipeline.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ResearchRequest(BaseModel):
    query: str = Field(min_length=3, max_length=1000)


def extract_sources(search_results: str) -> list[str]:
    urls = re.findall(r"https?://[^\s<>)\]}]+", search_results or "")
    cleaned: list[str] = []
    for url in urls:
        url = url.rstrip(".,;:\"'")
        if url not in cleaned:
            cleaned.append(url)
    return cleaned[:20]


def normalize_result(query: str, state: dict[str, Any]) -> dict[str, Any]:
    return {
        "query": query,
        "search_results": str(state.get("search_results", "")),
        "scraped_content": str(state.get("scraped_content", "")),
        "research_report": str(state.get("research_report", "")),
        "critic_feedback": str(state.get("critic_feedback", "")),
        "sources": extract_sources(str(state.get("search_results", ""))),
    }


@app.get("/")
def root() -> dict[str, str]:
    return {"name": "DeepScout API", "status": "online", "docs": "/docs"}


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/research")
async def research(body: ResearchRequest) -> dict[str, Any]:
    try:
        state = await run_in_threadpool(run_research_pipeline, body.query.strip())
        return normalize_result(body.query.strip(), state)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/api/research/stream")
async def research_stream(body: ResearchRequest) -> StreamingResponse:
    query_text = body.query.strip()
    event_queue: queue.Queue[dict[str, Any]] = queue.Queue()

    def progress(event: dict[str, Any]) -> None:
        event_queue.put(event)

    def worker() -> None:
        try:
            state = run_research_pipeline(query_text, on_progress=progress)
            event_queue.put({"type": "complete", "result": normalize_result(query_text, state)})
        except Exception as exc:
            event_queue.put({"type": "error", "message": str(exc)})

    threading.Thread(target=worker, daemon=True).start()

    async def events():
        while True:
            event = await asyncio.to_thread(event_queue.get)
            yield f"data: {json.dumps(event, ensure_ascii=False)}\n\n"
            if event.get("type") in {"complete", "error"}:
                break

    return StreamingResponse(
        events(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
