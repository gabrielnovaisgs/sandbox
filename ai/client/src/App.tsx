import { useState } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { role: 'user', text: input }])
    setInput('')
    // Simulate assistant response locally since backend isn't connected yet
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Estarei conectado com o backend em breve!' }])
    }, 1000)
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>AI Assistant</h1>
      </header>
      
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-state">Envie uma mensagem para começar.</div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <div className="message-bubble">{msg.text}</div>
            </div>
          ))
        )}
      </div>

      <div className="chat-input-area">
        <textarea 
          placeholder="Digite sua mensagem..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          rows={3}
        />
        <button onClick={handleSend} disabled={!input.trim()}>
          Enviar
        </button>
      </div>
    </div>
  )
}

export default App
