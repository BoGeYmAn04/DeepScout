import os

from dotenv import load_dotenv
from langchain_mistralai import ChatMistralAI

load_dotenv()

def get_mistral_llm():
    if not os.getenv("MISTRAL_API_KEY"):
        raise RuntimeError("MISTRAL_API_KEY is not configured.")

    return ChatMistralAI(
        model=os.getenv("MISTRAL_MODEL", "mistral-small-2603"),
        temperature=0,
        max_retries=2,
    )
