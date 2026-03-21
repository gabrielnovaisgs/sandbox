from tools import list_docs, get_list
from llm import model
from langchain_core.messages import SystemMessage, HumanMessage, ToolMessage, BaseMessage
from typing import List
from langchain.agents import create_agent
import langchain
langchain.debug = True


system = SystemMessage("Você é um ótimo ajudante conciso nas respostas")
agent = create_agent(model, tools=[get_list, list_docs], system_prompt=system)

text_input = input("Human: ")
human = HumanMessage(content=text_input)
response = agent.invoke({"messages": [human]})

# A resposta costuma vir como um dict contendo a lista de mensagens (MessagesState)
messages = response.get("messages", [])
if messages:
    last_message = messages[-1]
    
    print(f"\n[Resposta do Modelo]: {last_message.content}")
    
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        print("\n🚀 O Agente DECIDIU USAR AS SEGUINTES TOOLS:")
        for tool_call in last_message.tool_calls:
            print(f" - Tool: {tool_call['name']}")
            print(f" - Argumentos: {tool_call['args']}")
    else:
        print("\n❌ O Agente não chamou nenhuma tool.")
else:
    print(response)


