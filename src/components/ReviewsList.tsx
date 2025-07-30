import React, { useState } from 'react'
import { format } from 'date-fns'
import { ExternalLink, MessageSquare, Calendar, Hash, Search, Filter } from 'lucide-react'
import { type PRReview } from '../lib/supabase'

interface ReviewsListProps {
  reviews: PRReview[]
  onSelectReview: (review: PRReview) => void
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

export function ReviewsList({ reviews, onSelectReview }: ReviewsListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'pr_number'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filterPR, setFilterPR] = useState('')

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.review_body.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.pr_number.toString().includes(searchTerm)
    const matchesFilter = !filterPR || review.pr_number.toString() === filterPR
    return matchesSearch && matchesFilter
  })

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    let comparison = 0
    if (sortBy === 'date') {
      comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    } else {
      comparison = b.pr_number - a.pr_number
    }
    return sortOrder === 'desc' ? comparison : -comparison
  })

  const uniquePRs = [...new Set(reviews.map(r => r.pr_number))].sort((a, b) => b - a)

  return (
    <div className="bg-[#161b22] rounded-xl border border-[#30363d] overflow-hidden">
      <div className="p-6 border-b border-[#30363d]">
        <h2 className="text-xl font-semibold text-[#f0f6fc] mb-4 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-[#1f6feb]" />
          PR Reviews ({sortedReviews.length})
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#7d8590]" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-[#f0f6fc] placeholder-[#7d8590] focus:outline-none focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'pr_number')}
              className="px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:outline-none focus:ring-2 focus:ring-[#1f6feb] transition-all duration-200"
            >
              <option value="date">Sort by Date</option>
              <option value="pr_number">Sort by PR#</option>
            </select>
            
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:outline-none focus:ring-2 focus:ring-[#1f6feb] transition-all duration-200"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
            
            <select
              value={filterPR}
              onChange={(e) => setFilterPR(e.target.value)}
              className="px-3 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-[#f0f6fc] focus:outline-none focus:ring-2 focus:ring-[#1f6feb] transition-all duration-200"
            >
              <option value="">All PRs</option>
              {uniquePRs.map(pr => (
                <option key={pr} value={pr}>PR #{pr}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {sortedReviews.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50 text-[#7d8590]" />
            <p>No reviews found</p>
          </div>
        ) : (
          <div className="divide-y divide-[#30363d]">
            {sortedReviews.map((review) => (
              <div
                key={review.id}
                onClick={() => onSelectReview(review)}
                className="p-4 hover:bg-[#21262d] cursor-pointer transition-all duration-200 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center space-x-1 text-[#f0f6fc]">
                        <Hash className="h-4 w-4" />
                        <span className="font-medium">PR #{review.pr_number}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-[#7d8590] text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(review.created_at), 'MMM dd, yyyy HH:mm')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 mt-2">
                    <a
                      href={review.pr_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#1f6feb] hover:text-[#58a6ff] text-sm underline truncate block transition-colors duration-200"
                    >
                      {review.pr_link}
                    </a>
                  </div>
                  <a
                    href={review.pr_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="ml-4 p-2 text-[#7d8590] hover:text-[#f0f6fc] transition-colors duration-200 rounded-lg hover:bg-[#30363d]"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}