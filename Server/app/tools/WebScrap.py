from bs4 import BeautifulSoup
import requests
from langchain.tools import tool

@tool
def web_scrap(url: str) -> str:
    """
    Scrape the content of a web page given its URL. Returns the text content of the page.
    """
    try:
        response = requests.get(url,timeout=8,headers={'User-Agent': 'Mozilla/5.0'}) 
        response.raise_for_status()  
        soup = BeautifulSoup(response.text, 'html.parser')
        for tag in soup(['script', 'style','nav','footer']):
            tag.decompose()
        text_content = soup.get_text(separator='\n', strip=True)[:3000]
        return text_content
    except Exception as e:
        return f"An error occurred while scraping: {str(e)}"