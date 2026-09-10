from typing import Any

from langchain_core.output_parsers import StrOutputParser
from app.llm.gemini import get_gemini_llm
from app.prompts.CriticPrompt import critic_prompt
from app.prompts.WriterPrompt import writer_prompt

def build_writer_chain(model: Any | None = None):
    return writer_prompt | (model or get_gemini_llm()) | StrOutputParser()

def build_critic_chain(model: Any | None = None):
    return critic_prompt | (model or get_gemini_llm()) | StrOutputParser()
