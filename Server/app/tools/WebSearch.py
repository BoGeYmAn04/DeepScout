from langchain.tools import tool
from tavily import TavilyClient
import os
from dotenv import load_dotenv
from rich import print

load_dotenv()

tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

@tool
def web_search(query: str) -> str:
    """
   Search the web for recent and reliable information on a topic . Returns Titles , URLs and snippets.
    """
    try:
        out = []
        results = tavily.search(query,max_results=5)
        for r in results["results"]:
            title = r.get("title", "No title")
            url = r.get("url", "No URL")
            content = r.get("content", "No content")
            out.append(f"Title: {title}\nURL: {url}\nSnippet: {content}\n")
        return "\n".join(out)
    except Exception as e:
        return f"An error occurred while searching: {str(e)}"

