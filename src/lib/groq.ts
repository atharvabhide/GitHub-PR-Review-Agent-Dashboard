import Groq from 'groq-sdk'

const groqApiKey = import.meta.env.VITE_GROQ_API_KEY

let groq: Groq | null = null

if (groqApiKey && groqApiKey !== 'your_groq_api_key_here') {
  groq = new Groq({
    apiKey: groqApiKey,
    dangerouslyAllowBrowser: true
  })
}

export { groq }

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export async function sendChatMessage(
  messages: ChatMessage[],
  prContext: {
    prNumber: number
    reviewContent: string
    prLink: string
    createdAt: string
  }
): Promise<string> {
  if (!groq) {
    throw new Error('GROQ API key not configured. Please set VITE_GROQ_API_KEY in your .env.local file.')
  }

  const systemPrompt = `You are an AI assistant helping developers understand and analyze GitHub PR reviews. 

Context for this conversation:
- PR Number: #${prContext.prNumber}
- PR Link: ${prContext.prLink}
- Review Created: ${prContext.createdAt}
- Review Content: ${prContext.reviewContent}

You should:
1. Help explain the PR review comments in detail
2. Provide suggestions for addressing the feedback
3. Answer questions about the code review
4. Offer best practices related to the review points
5. Be concise but helpful in your responses

Keep your responses focused on the PR review context provided above.`

  const chatMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }))
  ]

  try {
    const completion = await groq.chat.completions.create({
      messages: chatMessages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1000,
    })

    return completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
  } catch (error) {
    console.error('GROQ API Error:', error)
    throw new Error('Failed to get response from AI assistant. Please try again.')
  }
}