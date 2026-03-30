
from langchain.agents import create_agent
from llm import model
from langchain_core.messages import SystemMessage, HumanMessage

agent = create_agent(model, system_prompt=SystemMessage("Você é um ótimo ajudante conciso nas respostas"))

response = agent.stream({"messages": [HumanMessage(input("Human: "))]})

for chunk in response:
    chunk_type, chunk_value = chunk
    print(chunk['messages'][-1].content, end="", flush=True)
    print("\n")