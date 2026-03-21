from pydantic import Field
from pydantic import BaseModel
from ntpath import join
from langchain_core.tools import tool
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

load_dotenv()
api_key = os.getenv("OPENROUTER_API_KEY")

model = ChatOpenRouter(
    model_name="nvidia/nemotron-3-nano-30b-a3b:free",
    api_key=api_key,
    reasoning={
        "effort": "none", # Desabilita o reasoning do modelo
    }
)
dir_path = "./examples/docs"

@tool("list_docs", description="Lista todos os documentos pessoais")
def list_docs()->list[str]:
    print("Entoru no get list")
    items = os.listdir(dir_path)
    print("items", items)
    return items


class GetListInput(BaseModel):
    """Input para o get list"""
    list_name: str = Field(description="Nome do documento para buscar a lista")




@tool("get_list",
    args_schema=GetListInput,
    description="A partir de um documento, retorna a lista de items que esse documento possui")
def get_list(list_name: str) -> list[str]:
    print("Entoru no get list")
    file = open(dir_path+"/"+list_name).read()
    items = file.split("\n")[1:]
    treated= list(map(lambda x: x[2:], items))
   
    return treated


model_with_tools = model.bind_tools([get_list, list_docs])

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
    response = model_with_tools.invoke(state['messages'])
    print("\n")
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
graph = builder.compile(checkpointer)

config = {"configurable": {"thread_id": "1"}}
response = model_with_tools.invoke("What's the weather like in Boston?")
for tool_call in response.tool_calls:
    # View tool calls made by the model
    print(f"Tool: {tool_call['name']}")
    print(f"Args: {tool_call['args']}")


# o Stream realiza o invoke do grafo, porém podendo escutar 
for chunk in graph.stream(
    {"count": 0},
    stream_mode=["messages"],
    version="v2",
    config=config
):
    # Olhando os checkpoints salvos em cada passoo da minha conversa, ele basicamente esta salvando cada etapa e cada passo que eu estou dando no meu nó
    if chunk["type"] == "checkpoints":
        snapshot = chunk["data"]       # StateSnapshot completo
        print(f"Checkpoint {snapshot['metadata']['step']}:")
        print(f"Estado: {snapshot['values']}")
        print(f"Próximos: {snapshot['next']}")
    
    if chunk["type"] == "messages":
        message_chunk, metadata = chunk["data"]
    
        if message_chunk.content and metadata["langgraph_node"] == "response":
             print(message_chunk.content, end="", flush=True)




