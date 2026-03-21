from tools import list_docs, get_list
from model import model
from langchain_core.messages import SystemMessage, HumanMessage, ToolMessage, BaseMessage
from typing import List
from langchain.agents import create_agent


system = SystemMessage("Você é um ótimo ajudante conciso nas respostas")
agent = create_agent(model, tools=[get_list, list_docs], system_prompt=system)

if __name__ == "__main__":
    messages: List[BaseMessage] = [system]

    text_input = input("Human: ")
    human = HumanMessage(content=text_input)
    response = agent.invoke(human)
    print(response)