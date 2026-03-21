import os
from pydantic import BaseModel, Field
from langchain_core.tools import tool

dir_path = "./examples/docs"

@tool("list_docs", description="Lista todos os documentos pessoais")
def list_docs() -> str:
    """Busca os documentos disponíveis no diretório"""
    print("listou os documentos")
    items = os.listdir(dir_path)
    return ", ".join(items)


class GetListInput(BaseModel):
    """Input para o get list"""
    list_name: str = Field(description="Nome do documento com a extensão para buscar a lista (ex: lista_animais.txt)")


@tool("get_list", args_schema=GetListInput, description="Lista itens a partir do nome de um documento")
def get_list(list_name: str) -> str:
    """Abre um documento e extrai os itens da lista."""
    print(f"Entrou no get list buscando: {list_name}")
    file_path = os.path.join(dir_path, list_name)
    
    with open(file_path, "r", encoding="utf-8") as file:
        lines = file.read().split("\n")[1:]  # Ignora a primeira linha (cabeçalho)
        
    # Remove os caracteres '- ' do início e ignora linhas vazias
    treated_items = [line[2:] for line in lines if line.startswith("- ")]
    return ", ".join(treated_items)