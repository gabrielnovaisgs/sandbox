from langchain_core.messages import SystemMessage
from simple_agent_tool_call import agent
from langchain_core.messages import HumanMessage, AIMessage
from langchain_openrouter import ChatOpenRouter
from langgraph.graph  import StateGraph, MessagesState
from langgraph.constants import END, START
from operator import add
from typing import Annotated
from langgraph.checkpoint.memory import InMemorySaver  

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
    response = agent.invoke(state['messages'], config)
    print("\n")
    return {'count': 1, 'messages': response['messages'][-1]}

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
graph = builder.compile(checkpointer)



# o Stream realiza o invoke do grafo, porém podendo escutar 
for chunk in graph.stream(
    {"count": 0},
    stream_mode=["messages", "updates"],
    version="v2",
    config=config
):
    # Olhando os checkpoints salvos em cada passoo da minha conversa, ele basicamente esta salvando cada etapa e cada passo que eu estou dando no meu nó
    #if chunk["type"] == "checkpoints":
    #    snapshot = chunk["data"]       # StateSnapshot completo
    #    print(f"Checkpoint {snapshot['metadata']['step']}:")
    #    print(f"Estado: {snapshot['values']}")
    #    print(f"Próximos: {snapshot['next']}")
    if chunk["type"] == "messages":
        message_chunk, metadata = chunk["data"]
        if message_chunk.content and metadata["langgraph_node"] == "response":
            print(message_chunk.content, end="", flush=True)
        elif chunk["type"] == "updates":
            print(f"Update: {chunk['data']}")




