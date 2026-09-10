import os

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()

def get_mistral_llm():
    if not os.getenv("OPENROUTER_API_KEY"):
        raise RuntimeError("OPENROUTER_API_KEY is not configured.")

    return ChatOpenAI(
        model=os.getenv("OPENROUTER_MODEL", "openrouter/free"),
        api_key=os.getenv("OPENROUTER_API_KEY"),
        base_url="https://openrouter.ai/api/v1",
        temperature=0,
    )

