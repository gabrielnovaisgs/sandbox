from collections.abc import AsyncIterable
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.sse import EventSourceResponse, ServerSentEvent
from pydantic import BaseModel


app = FastAPI()

# Allow all origins for CORS (customize as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def get():
    html_content = open("index.html").read()
    return HTMLResponse(html_content)

class Item(BaseModel):
    name: str
    value: int

items = [
    Item(name="Item 1", value=10),
    Item(name="Item 2", value=20),
    Item(name="Item 3", value=30),
]

@app.get("/events/stream", response_class=EventSourceResponse)
async def events() -> AsyncIterable[ServerSentEvent]:
    yield ServerSentEvent(data="Evento sem tipo")
    yield ServerSentEvent(comment="Comentário antes do envio")
    yield ServerSentEvent(data="START", event="items")
    for item in items:
        yield ServerSentEvent(data=item, event="items")
    yield ServerSentEvent(data="END", event="items")
