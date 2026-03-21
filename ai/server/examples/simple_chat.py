from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langgraph.graph  import StateGraph, MessagesState
from langgraph.constants import END, START
from operator import add
from typing import Annotated
from langgraph.checkpoint.memory import InMemorySaver  
from llm import model


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
