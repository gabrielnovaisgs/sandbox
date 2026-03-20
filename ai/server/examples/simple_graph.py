
from operator import add
from langgraph.constants import END, START
from langgraph.graph import StateGraph
from typing import TypedDict, Annotated

# Utilizando a função add do python para concatenar a lista do state antigo com o novo state
class State(TypedDict):
    nodes_path: Annotated[list[str], add]


def node_a(state: State) -> State:
    print(state)
    newState: State = {'nodes_path': ['A']}
    return newState
    

def node_b(state: State) -> State:
    print(state)
    newState: State = {'nodes_path': ['B']}
    return newState
    
def node_c(state: State) -> None:
    print(state)

builder = StateGraph(State)

builder.add_node("A", node_a)
builder.add_node("B", node_b)
builder.add_node("C", node_c)

builder.add_edge(START, "A")
builder.add_edge( "A", "B")
builder.add_edge( "B", "C")
builder.add_edge("C", END)

graph = builder.compile()

graph.invoke(State(nodes_path=[]))