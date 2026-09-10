from typing import Any
from langchain.agents import create_agent
from app.llm.gemini import get_gemini_llm
from app.tools.WebSearch import web_search

def build_search_agent(model: Any | None = None):
    return create_agent(
        model=model or get_gemini_llm(),
        tools=[web_search],
    )
