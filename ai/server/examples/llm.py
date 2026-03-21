from langchain_openrouter import ChatOpenRouter
from langchain_ollama import ChatOllama
#from config import OPENROUTER_API_KEY

# Centralized model initialization
#ChatOpenRouter(
#    model_name="nvidia/nemotron-3-nano-30b-a3b:free",
#    api_key=OPENROUTER_API_KEY, # type: ignore
#    reasoning={
#        "effort": "none", # Desabilita o reasoning do modelo
#    }
#)
model = ChatOllama(
    model="qwen3.5:4b",
    reasoning=True
)