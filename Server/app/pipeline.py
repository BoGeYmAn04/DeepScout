from app.agents.SearchAgent import build_search_agent
from app.agents.ReaderAgent import build_reader_agent
from app.chains.chain import writer_chain, critic_chain

def run_research_pipeline(query: str) -> dict:

    state = {}
    search_agent = build_search_agent()
    search_results = search_agent.invoke({
        "messages": [("user", f"Find recent,reliable, and relevant information about {query}.")]
    })
    state["search_results"] = search_results["messages"][-1].content

    reader_agent = build_reader_agent()
    reader_results = reader_agent.invoke({
        "messages": [("user", 
            f"Based on the following search results about '{query}',"
            f"pick the most relevant url and scrape it in a deeper content.\n\n"
            f"Search Results:\n{state['search_results'][:800]}"
        )]
    })
    state["scraped_content"] = reader_results["messages"][-1].content

    research_combined = (
        f"Search Results:\n{state['search_results']}\n\n"
        f"Scraped Content:\n{state['scraped_content']}"
    )

    writer_results = writer_chain.invoke({
        "topic": query,
        "research": research_combined
    })
    state["research_report"] = writer_results

    critic_results = critic_chain.invoke({
        "report": state["research_report"]
    })
    state["critic_feedback"] = critic_results

    return state


if __name__ == "__main__":
    query = "The impact of climate change on global agriculture"
    results = run_research_pipeline(query)
    print("Research Report:\n", results["research_report"])
    print("\nCritic Feedback:\n", results["critic_feedback"])