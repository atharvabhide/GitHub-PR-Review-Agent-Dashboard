import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, MessageCircle } from 'lucide-react'
import { sendChatMessage, type ChatMessage } from '../lib/groq'
import { type PRReview } from '../lib/supabase'

interface ChatInterfaceProps {
  review: PRReview
}

export function ChatInterface({ review }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setError(null)

    try {
      const prContext = {
        prNumber: review.pr_number,
        reviewContent: review.review_body,
        prLink: review.pr_link,
        createdAt: review.created_at
      }

      const response = await sendChatMessage([...messages, userMessage], prContext)

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="bg-[#21262d] rounded-xl border border-[#30363d] flex flex-col h-full">
      <div className="flex items-center space-x-2 p-4 border-b border-[#30363d]">
        <div className="p-2 bg-[#238636]/20 rounded-lg">
          <MessageCircle className="h-4 w-4 text-[#238636]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#f0f6fc]">AI Assistant</h3>
          <p className="text-[#7d8590] text-sm">Ask questions about this PR review</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="text-center text-[#7d8590] py-8">
            <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Start a conversation about this PR review!</p>
            <p className="text-xs mt-2">Ask questions like:</p>
            <ul className="text-xs mt-2 space-y-1 text-[#656d76]">
              <li>• "What are the main issues in this review?"</li>
              <li>• "How can I fix these problems?"</li>
              <li>• "Explain the security concerns mentioned"</li>
            </ul>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                <Bot className="h-4 w-4 text-[#238636]" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl p-3 ${
                message.role === 'user'
                  ? 'bg-[#1f6feb] text-[#f0f6fc]'
                  : 'bg-[#30363d] text-[#e6edf3]'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
            {message.role === 'user' && (
              <div className="p-2 bg-[#30363d] rounded-lg flex-shrink-0">
                <User className="h-4 w-4 text-[#e6edf3]" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-[#238636]/20 rounded-lg">
              <Bot className="h-4 w-4 text-[#238636]" />
            </div>
            <div className="bg-[#30363d] rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-[#238636]" />
                <span className="text-sm text-[#e6edf3]">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-[#da3633]/20 border border-[#da3633]/30 rounded-xl p-3">
            <p className="text-[#f85149] text-sm">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-[#30363d]">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about this PR review..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-[#f0f6fc] placeholder-[#7d8590] focus:outline-none focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent transition-all duration-200 disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] disabled:bg-[#30363d] disabled:cursor-not-allowed text-[#f0f6fc] rounded-lg transition-all duration-200 flex items-center space-x-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}