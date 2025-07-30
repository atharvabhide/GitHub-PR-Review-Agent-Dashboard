import React from 'react'
import { format } from 'date-fns'
import { X, ExternalLink, Calendar, Hash, MessageSquare, Copy } from 'lucide-react'
import { type PRReview } from '../lib/supabase'
import { ChatInterface } from './ChatInterface'

interface ReviewDetailProps {
  review: PRReview
  onClose: () => void
}

export function ReviewDetail({ review, onClose }: ReviewDetailProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const parseReviewContent = (content: string) => {
    // Remove any headers and HTML tags
    let cleanContent = content
      .replace(/^\*\*[^*]+\*\*\s*/i, '') // Remove any bold headers at the start
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*([^*]+)\*/g, '$1') // Remove italic markdown
      .replace(/`([^`]+)`/g, '$1') // Remove code markdown
      .trim()

    // Split by lines and filter out empty lines
    const lines = cleanContent.split('\n').filter(line => line.trim())
    
    return lines
  }

  const reviewLines = parseReviewContent(review.review_body)

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-[#161b22] rounded-xl border border-[#30363d] max-w-7xl w-full max-h-[95vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-[#30363d]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#1f6feb]/20 rounded-lg">
              <MessageSquare className="h-5 w-5 text-[#1f6feb]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#f0f6fc]">PR Review Details</h2>
              <p className="text-[#7d8590] text-sm">Review #{review.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#7d8590] hover:text-[#f0f6fc] hover:bg-[#21262d] rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#21262d] rounded-xl p-4 border border-[#30363d]">
              <div className="flex items-center space-x-2 text-[#7d8590] mb-2">
                <Hash className="h-4 w-4" />
                <span className="text-sm font-medium">PR Number</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-[#f0f6fc]">#{review.pr_number}</span>
                <button
                  onClick={() => copyToClipboard(review.pr_number.toString())}
                  className="p-1 text-[#7d8590] hover:text-[#f0f6fc] transition-colors duration-200 rounded hover:bg-[#30363d]"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="bg-[#21262d] rounded-xl p-4 border border-[#30363d]">
              <div className="flex items-center space-x-2 text-[#7d8590] mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">Created</span>
              </div>
              <div className="text-[#f0f6fc]">
                <div className="font-semibold">{format(new Date(review.created_at), 'MMM dd, yyyy')}</div>
                <div className="text-sm text-[#7d8590]">{format(new Date(review.created_at), 'HH:mm:ss')}</div>
              </div>
            </div>

            <div className="bg-[#21262d] rounded-xl p-4 border border-[#30363d]">
              <div className="flex items-center space-x-2 text-[#7d8590] mb-2">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm font-medium">Review Length</span>
              </div>
              <div className="text-2xl font-bold text-[#f0f6fc]">{review.review_body.length}</div>
              <div className="text-sm text-[#7d8590]">characters</div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* PR Link Section - Shared across both columns */}
            <div className="xl:col-span-2">
              <div className="bg-[#21262d] rounded-xl p-4 border border-[#30363d]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4 text-[#1f6feb]" />
                    <span className="text-sm font-medium text-[#7d8590]">PR Link</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(review.pr_link)}
                      className="p-2 text-[#7d8590] hover:text-[#f0f6fc] hover:bg-[#30363d] rounded-lg transition-all duration-200"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <a
                      href={review.pr_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-[#7d8590] hover:text-[#f0f6fc] hover:bg-[#30363d] rounded-lg transition-all duration-200"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
                <a
                  href={review.pr_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1f6feb] hover:text-[#58a6ff] underline break-all transition-colors duration-200 font-medium text-sm mt-2 block"
                >
                  {review.pr_link}
                </a>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#f0f6fc]">Review Content</h3>
                  <button
                    onClick={() => copyToClipboard(review.review_body)}
                    className="flex items-center space-x-2 px-3 py-1 text-[#7d8590] hover:text-[#f0f6fc] hover:bg-[#21262d] rounded-lg transition-all duration-200"
                  >
                    <Copy className="h-4 w-4" />
                    <span className="text-sm">Copy</span>
                  </button>
                </div>
                <div className="bg-[#21262d] rounded-xl p-6 border border-[#30363d] h-[400px] overflow-y-auto">
                  <div className="text-[#e6edf3] text-sm leading-relaxed">
                    {reviewLines.length > 1 ? (
                      <ol className="list-decimal list-inside space-y-2">
                        {reviewLines.map((line, index) => (
                          <li key={index} className="text-[#e6edf3]">
                            <span className="ml-2">{line.trim()}</span>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-[#e6edf3]">{reviewLines[0] || review.review_body}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="h-[500px]">
                <ChatInterface review={review} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}