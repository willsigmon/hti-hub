import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  memberName: string
  memberRole: string
}

export default function ChatInterface({ memberName, memberRole }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getSystemPrompt = () => {
    const roleContext = memberRole.toLowerCase()
    if (roleContext.includes('business')) {
      return `You are ${memberName}'s AI assistant at HTI (HubZone Technology Initiative). You specialize in partnership strategies, donor outreach, corporate sponsorships, and fundraising goals. HTI has an $85k budget deficit for 2026 that needs to be addressed through equipment sales, grants, and donations. Be concise and strategic.`
    } else if (roleContext.includes('grant')) {
      return `You are ${memberName}'s AI assistant at HTI (HubZone Technology Initiative). You specialize in grant writing, deadline tracking, application strategies, and foundation research. Key opportunity: NC Digital Equity Grant. Be concise and action-oriented.`
    } else if (roleContext.includes('operations')) {
      return `You are ${memberName}'s AI assistant at HTI (HubZone Technology Initiative). You specialize in equipment inventory, logistics, operational efficiency, and device deployment. Equipment sales are the most fruitful revenue opportunity. Be concise and practical.`
    }
    return `You are ${memberName}'s AI assistant at HTI (HubZone Technology Initiative). You help with program coordination, digital literacy initiatives, and community outreach. Be concise and supportive.`
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Using Manus API via the browse_web proxy or direct fetch
      // For now, we'll simulate the response since we need backend proxy for CORS
      // In production, this would call your backend which calls Manus API

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: getSystemPrompt() },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: input.trim() },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || data.content || 'I apologize, I encountered an issue processing your request.',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      // Fallback: Generate a contextual mock response for demo
      const mockResponses: Record<string, string[]> = {
        business: [
          "Based on HTI's donor data, I recommend focusing on the top 2% who drive 80% of donations. Let's identify 3 high-potential corporate sponsors in the Triangle area.",
          "For the $85k deficit, I suggest a three-pronged approach: 1) Equipment sales push ($40k target), 2) NC Digital Equity Grant ($25k), 3) Year-end donor campaign ($20k).",
          "I've analyzed similar nonprofits - the most successful ones do quarterly donor appreciation events. Should I draft a plan for Q1 2026?",
        ],
        grant: [
          "The NC Digital Equity Grant deadline is in 3 days. The narrative draft needs: 1) Impact metrics from 2024, 2) Community partnership letters, 3) Budget justification. Which should we tackle first?",
          "I found 5 foundation grants matching HTI's profile with deadlines in Q1. Duke Endowment ($50k) looks most promising - 92% alignment with our mission.",
          "For the grant narrative, I recommend leading with the 500+ devices deployed metric. It's your strongest impact story.",
        ],
        operations: [
          "Current inventory shows 47 refurbished laptops ready for sale. Market analysis suggests pricing at $150-200 each for $8k-9.5k revenue.",
          "Operational efficiency tip: Batch processing device refurbishment on Tuesdays/Thursdays could increase throughput by 40%.",
          "I've mapped optimal distribution routes for the next deployment. We can reduce travel costs by 23% by clustering deliveries.",
        ],
        default: [
          "I'm here to help with HTI's mission. What specific area would you like to focus on today?",
          "Let me analyze that for you. Based on HTI's current data, I have some recommendations.",
          "Great question! Here's what I'm seeing in the data...",
        ],
      }

      const roleKey = memberRole.toLowerCase().includes('business')
        ? 'business'
        : memberRole.toLowerCase().includes('grant')
        ? 'grant'
        : memberRole.toLowerCase().includes('operations')
        ? 'operations'
        : 'default'

      const responses = mockResponses[roleKey]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      toast.info('Running in demo mode - connect API for live responses')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-80">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
        {messages.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-8">
            Start a conversation with {memberName.split(' ')[0]}'s AI assistant
          </p>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-6 h-6 bg-hti-orange rounded-full flex items-center justify-center flex-shrink-0">
                <Bot size={14} className="text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                message.role === 'user'
                  ? 'bg-hti-navy text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              {message.content}
            </div>
            {message.role === 'user' && (
              <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={14} className="text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2 justify-start">
            <div className="w-6 h-6 bg-hti-orange rounded-full flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-white" />
            </div>
            <div className="bg-gray-700 rounded-lg px-3 py-2">
              <Loader2 size={16} className="text-gray-300 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask ${memberName.split(' ')[0]}'s AI...`}
          className="flex-1 bg-gray-700 text-white text-sm rounded-lg px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-hti-orange"
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || isLoading}
          className="bg-hti-orange hover:bg-hti-orange-dark disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 transition-colors"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
