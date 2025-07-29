import React from 'react'
import { format } from 'date-fns'
import { X, ExternalLink, Calendar, Hash, MessageSquare, Copy } from 'lucide-react'
import { type PRReview } from '../lib/supabase'

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-gray-800 rounded-xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-black/20 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">PR Review Details</h2>
              <p className="text-gray-500 text-sm">Review #{review.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
              <div className="flex items-center space-x-2 text-gray-400 mb-2">
                <Hash className="h-4 w-4" />
                <span className="text-sm font-medium">PR Number</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">#{review.pr_number}</span>
                <button
                  onClick={() => copyToClipboard(review.pr_number.toString())}
                  className="p-1 text-gray-500 hover:text-white transition-colors duration-200 rounded hover:bg-gray-600"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
              <div className="flex items-center space-x-2 text-gray-400 mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">Created</span>
              </div>
              <div className="text-white">
                <div className="font-semibold">{format(new Date(review.created_at), 'MMM dd, yyyy')}</div>
                <div className="text-sm text-gray-500">{format(new Date(review.created_at), 'HH:mm:ss')}</div>
              </div>
            </div>

            <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
              <div className="flex items-center space-x-2 text-gray-400 mb-2">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm font-medium">Review Length</span>
              </div>
              <div className="text-2xl font-bold text-white">{review.review_body.length}</div>
              <div className="text-sm text-gray-500">characters</div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Review Content</h3>
                <button
                  onClick={() => copyToClipboard(review.review_body)}
                  className="flex items-center space-x-2 px-3 py-1 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                >
                  <Copy className="h-4 w-4" />
                  <span className="text-sm">Copy</span>
                </button>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                <div className="text-gray-300 text-sm leading-relaxed">
                  {reviewLines.length > 1 ? (
                    <ol className="list-decimal list-inside space-y-2">
                      {reviewLines.map((line, index) => (
                        <li key={index} className="text-gray-300">
                          <span className="ml-2">{line.trim()}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-gray-300">{reviewLines[0] || review.review_body}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">PR Link</h3>
              <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                <div className="flex items-center justify-between">
                  <a
                    href={review.pr_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline break-all transition-colors duration-200 font-medium"
                  >
                    {review.pr_link}
                  </a>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => copyToClipboard(review.pr_link)}
                      className="p-2 text-gray-500 hover:text-white hover:bg-gray-600 rounded-lg transition-all duration-200"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <a
                      href={review.pr_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-white hover:bg-gray-600 rounded-lg transition-all duration-200"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}