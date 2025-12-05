'use client'

import { useState } from 'react'


export default function StefaniaPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { role: 'user', content: input }])
    setInput('')
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-3xl font-bold text-primary">Stefania</h1>
        <p className="text-sm text-text-secondary mt-1">Interface LLM</p>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-text-secondary">
            <p>Inicie uma conversa digitando uma mensagem abaixo.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-primary text-white ml-auto max-w-[80%]'
                    : 'bg-surface border border-border max-w-[80%]'
                }`}
              >
                <p>{msg.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-6 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSend}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined w-5 h-5">send</span>
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}

