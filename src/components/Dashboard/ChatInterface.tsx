'use client'

import { useEffect, useRef, useState } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { TextStreamChatTransport } from 'ai'
import { useChat } from '@ai-sdk/react'
import { toast } from 'sonner'
import { useHubby } from '@/contexts/HubbyContext'

interface ChatInterfaceProps {
  memberName: string
  memberRole: string
}

export default function ChatInterface({ memberName, memberRole }: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { triggerReaction } = useHubby()

  const { messages, status, sendMessage, error } = useChat({
    transport: new TextStreamChatTransport({
      api: '/api/chat',
      body: { memberRole },
    }),
    onError: () => {
      triggerReaction('error')
      toast.error('Failed to get response', {
        description: 'Check your API key or try again later',
      })
    },
  })

  const isLoading = status === 'submitted' || status === 'streaming'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (status === 'streaming') {
      triggerReaction('thinking')
    } else if (status === 'ready' && messages.length > 0) {
      triggerReaction('success')
    }
  }, [status, messages.length, triggerReaction])

  useEffect(() => {
    if (error) {
      console.error('Chat error:', error)
    }
  }, [error])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput('')
  }

  return (
    <div className="flex flex-col h-80">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1 scrollbar-thin">
        {messages.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-8">
            Start a conversation with {memberName.split(' ')[0]}'s AI assistant
          </p>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot size={14} className="text-primary-foreground" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground border border-border'
              }`}
            >
              {message.parts?.map((part, i) => {
                if (part.type === 'text') {
                  return <span key={i}>{part.text}</span>
                }
                return null
              })}
            </div>
            {message.role === 'user' && (
              <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 border border-border">
                <User size={14} className="text-foreground" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2 justify-start">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-primary-foreground" />
            </div>
            <div className="bg-secondary rounded-lg px-3 py-2 border border-border">
              <Loader2 size={16} className="text-muted-foreground animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ${memberName.split(' ')[0]}'s AI...`}
          className="flex-1 bg-secondary text-foreground text-sm rounded-lg px-3 py-2 placeholder-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-lg px-3 py-2 transition-all shadow-lg border-glow"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}
