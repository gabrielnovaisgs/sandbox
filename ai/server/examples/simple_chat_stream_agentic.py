from tools import list_docs, get_list
from model import model
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage, BaseMessage, ToolMessage
from langchain.agents import create_agent
from typing import List, Annotated
from operator import add
from langgraph.graph import StateGraph, MessagesState
from langgraph.constants import END
from langgraph.checkpoint.memory import InMemorySaver

# Agent com tools
agent_system = SystemMessage("Você é um ótimo ajudante conciso nas respostas")
agent = create_agent(model, tools=[get_list, list_docs], system_prompt=agent_system)

config = {"configurable": {"thread_id": "1"}}

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
    response = agent.invoke({"messages": state['messages']}, config)
    print("\n")
    return {'count': 1, 'messages': response['messages'][-1]}

def handle_exit(state: State):
    last_message = state['messages'][-1].content
    if last_message == "exit":
        return END
    return "response"

builder = StateGraph(State)

builder.add_node("setup", setup_model)
builder.add_node("input", input_node)
builder.add_node("response", response_node)

builder.set_entry_point("setup")
builder.add_edge("setup", "input")
builder.add_conditional_edges("input", handle_exit)
builder.add_edge("response", "input")

checkpointer = InMemorySaver()
graph = builder.compile(checkpointer)

# Stream do grafo — escuta tokens da LLM e updates de nós
# subgraphs=True propaga os eventos do agente interno (também um grafo compilado)
for chunk in graph.stream(
    {"count": 0},
    stream_mode=["messages", "updates"],
    version="v2",
    config=config,
    subgraphs=True,
):
    if chunk["type"] == "messages":
        message_chunk, metadata = chunk["data"]
        # Tokens de texto da LLM
        if message_chunk.content:
            print(message_chunk.content, end="", flush=True)
        # Início de uma tool call (AIMessageChunk com tool_call_chunks)
        if hasattr(message_chunk, "tool_call_chunks") and message_chunk.tool_call_chunks:
            for tc in message_chunk.tool_call_chunks:
                if tc.get("name"):
                    print(f"\n[Tool call: {tc['name']}]", flush=True)
    elif chunk["type"] == "updates":
        for node_name, state_update in chunk["data"].items():
            # Detecta ToolMessages no estado atualizado (resultado das tools)
            messages_in_update = state_update.get("messages", [])
            if not isinstance(messages_in_update, list):
                messages_in_update = [messages_in_update]
            for msg in messages_in_update:
                if isinstance(msg, ToolMessage):
                    print(f"\n[Tool result ({msg.name}): {msg.content}]", flush=True)
#