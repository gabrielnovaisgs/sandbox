import os
from dotenv import load_dotenv
from langchain_openrouter import ChatOpenRouter

load_dotenv()
api_key: str | None = os.getenv("OPENROUTER_API_KEY")

model = ChatOpenRouter(
    model_name="nvidia/nemotron-3-nano-30b-a3b:free",
    api_key=api_key, # type: ignore
    reasoning={
        "effort": "none", # Desabilita o reasoning do modelo
    }
)
