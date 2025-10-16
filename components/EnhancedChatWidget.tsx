
import React, { useState, useEffect, useRef } from 'react'
import { logChat } from '../lib/supabase_client'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function EnhancedChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I am here to help you find the perfect organic fertilizer for your needs. What are you growing?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          sessionId,
          history: messages.slice(-5) // Send last 5 messages for context
        })
      })

      const data = await response.json()

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      // Log to Supabase
      await logChat(sessionId, input, data.response)
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or contact us directly.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 bg-green-700 hover:bg-green-800 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <div className="relative">
          {isOpen ? (
            <svg className="w-6 h-6 transition-transform duration-300 rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <>
              <svg className="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </>
          )}
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 md:bottom-24 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-md h-[500px] md:h-[550px] bg-white rounded-lg shadow-2xl flex flex-col animate-slideUp">
          {/* Header */}
          <div className="bg-green-700 text-white p-4 rounded-t-lg">
            <h3 className="font-semibold text-lg">Nature's Way Soil Assistant</h3>
            <p className="text-sm text-green-100">Powered by AI - Ask me anything!</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-green-700 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about our products..."
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
