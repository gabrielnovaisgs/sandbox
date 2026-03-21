from tools import list_docs, get_list
from model import model
from langchain_core.messages import SystemMessage, HumanMessage, ToolMessage, BaseMessage
from typing import List

model_with_tools = model.bind_tools([get_list, list_docs])
system = SystemMessage("Você é um ótimo ajudante conciso nas respostas")
messages: List[BaseMessage] = [system]

text_input = input("Human: ") 
human = HumanMessage(content=text_input)
messages.append(human)

response = model_with_tools.invoke(messages)
messages.append(response) # CRÍTICO: Sempre temos que dar push na resposta do bot que solicitou a tool antes de devolver o resultado!

for tool_call in response.tool_calls:
    print(f"Tool: {tool_call['name']}")
    print(f"Args: {tool_call['args']}")
    
    if tool_call['name'] == 'get_list':
        tool_result = get_list.invoke({'list_name': tool_call['args']['list_name']})
        messages.append(ToolMessage(content=tool_result, tool_call_id=tool_call["id"]))
        
    elif tool_call['name'] == 'list_docs':
        tool_result = list_docs.invoke({})
        messages.append(ToolMessage(content=tool_result, tool_call_id=tool_call["id"]))

# Após alimentar as respostas das tools de volta para a lista de mensagens, executamos o modelo de novo
if response.tool_calls:
    final = model_with_tools.invoke(messages)
    print(f"AI: {final.content}")
else:
    print(f"AI: {response.content}")