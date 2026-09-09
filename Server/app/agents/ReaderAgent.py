from langchain.agents import create_agent
from app.llm.gemini import get_llm
from app.tools.WebScrap import web_scrap

llm = get_llm()

def build_reader_agent():
    tools = [web_scrap]
    agent = create_agent(
        model=llm,
        tools=tools
    )
    return agent