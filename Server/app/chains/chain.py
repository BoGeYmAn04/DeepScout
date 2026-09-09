from app.llm.gemini import get_llm
from app.prompts.CriticPrompt import critic_prompt
from app.prompts.WriterPrompt import writer_prompt
from langchain_core.output_parsers import StrOutputParser


llm = get_llm()

writer_chain = writer_prompt | llm | StrOutputParser()
critic_chain = critic_prompt | llm | StrOutputParser()