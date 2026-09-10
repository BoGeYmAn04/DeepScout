import os

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()

api_key = os.getenv("OPENROUTER_API_KEY")
model = os.getenv("OPENROUTER_MODEL", "openrouter/free")

if not api_key:
    raise RuntimeError("OPENROUTER_API_KEY not found in .env")

print(f"Testing OpenRouter model: {model}")

try:
    llm = ChatOpenAI(
        model=model,
        api_key=api_key,
        base_url="https://openrouter.ai/api/v1",
        temperature=0,
        max_retries=0,
    )

    response = llm.invoke(
        "Reply with exactly this sentence: OpenRouter is working."
    )

    print("\nSUCCESS")
    print("Response:")
    print(response.content)

except Exception as e:
    print("\nFAILED")
    print(type(e).__name__)
    print(e)
