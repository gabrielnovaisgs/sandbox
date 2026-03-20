from langchain_core.messages import SystemMessage
import os
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, AIMessage
from langchain_openrouter import ChatOpenRouter
from langgraph.graph  import StateGraph, MessagesState
from langgraph.constants import END, START
from operator import add
from typing import Annotated
from langgraph.checkpoint.memory import InMemorySaver  
# Carrega as variáveis do arquivo .env
load_dotenv()
api_key = os.getenv("OPENROUTER_API_KEY")

model = ChatOpenRouter(
    model_name="nvidia/nemotron-3-nano-30b-a3b:free",
    api_key=api_key,
    reasoning={
        "effort": "none", # Desabilita o reasoning do modelo
    }
)


class State(MessagesState):
    count: Annotated[int, add]

def setup_model(state: State) -> State:
    system_message = SystemMessage("Seja conciso")
    return {'messages': system_message}

def input_node(state: State) -> State:
    response = input("Human: ")
    message = HumanMessage(response)
    return {'count': 1, 'messages': message}

def response_node(state: State) -> State:
    response = model.invoke(state['messages'])
    print(f"AI: {response.content}")
    return {'count': 1, 'messages': response}

def handle_exit(state: State):
    last_message = state['messages'][-1].content
    if(last_message == "exit"):
        return END
    return "response"

builder = StateGraph(State)

builder.add_node("setup", setup_model)
builder.add_node("input", input_node)
builder.add_node("response", response_node)


builder.set_entry_point( "setup")
builder.add_edge("setup", "input")
builder.add_conditional_edges("input", handle_exit)
builder.add_edge("response", "input")



checkpointer = InMemorySaver()
graph = builder.compile(checkpointer=checkpointer)
config = {"configurable": {"thread_id": "1"}}
response = graph.invoke(State(count=0), config )
print(response)

response = graph.invoke(State(count=0), config )
