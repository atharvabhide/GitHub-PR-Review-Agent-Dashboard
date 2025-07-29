import React, { useState } from 'react'
import { BarChart3, Calendar, Hash, MessageSquare, TrendingUp, Users, Activity, GitPullRequest } from 'lucide-react'
import { usePRReviews } from './hooks/usePRReviews'
import { useStats } from './hooks/useStats'
import { StatCard } from './components/StatCard'
import { ReviewsList } from './components/ReviewsList'
import { ReviewDetail } from './components/ReviewDetail'
import { LoadingSpinner } from './components/LoadingSpinner'
import { type PRReview } from './lib/supabase'

function App() {
  const { reviews, loading, error } = usePRReviews()
  const stats = useStats(reviews)
  const [selectedReview, setSelectedReview] = useState<PRReview | null>(null)

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8 text-center max-w-md">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-white mb-2">Connection Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <p className="text-gray-500 text-sm">
            Please check your Supabase configuration and ensure your table name is 'GitHub PR Review Agent'.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
              <GitPullRequest className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">GitHub PR Review Agent Dashboard</h1>
              <p className="text-gray-500">Real-time insights and analytics</p>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Reviews"
            value={stats.totalReviews}
            subtitle="All time"
            icon={<MessageSquare className="h-6 w-6" />}
          />
          <StatCard
            title="Today"
            value={stats.reviewsToday}
            subtitle="Reviews today"
            trend={stats.reviewsToday > 0 ? 'up' : 'neutral'}
            icon={<Calendar className="h-6 w-6" />}
          />
          <StatCard
            title="This Week"
            value={stats.reviewsThisWeek}
            subtitle="Weekly activity"
            trend={stats.reviewsThisWeek > stats.reviewsToday ? 'up' : 'neutral'}
            icon={<TrendingUp className="h-6 w-6" />}
          />
          <StatCard
            title="Avg Length"
            value={stats.avgReviewLength}
            subtitle="Characters"
            icon={<BarChart3 className="h-6 w-6" />}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Hash className="h-5 w-5 mr-2 text-blue-400" />
              Top PRs
            </h3>
            <div className="space-y-3">
              {stats.topPRs.slice(0, 5).map((pr, index) => (
                <div key={pr.prNumber} className="flex items-center justify-between group hover:bg-gray-700/50 rounded-lg p-2 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-xs font-bold text-blue-400 border border-blue-500/30">
                      {index + 1}
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors duration-200">PR #{pr.prNumber}</span>
                  </div>
                  <span className="text-white font-semibold">{pr.count} reviews</span>
                </div>
              ))}
              {stats.topPRs.length === 0 && (
                <p className="text-gray-500 text-center py-4">No data available</p>
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-400" />
              Recent Activity
            </h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 group hover:bg-gray-700/50 rounded-lg p-2 transition-all duration-200">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-300 text-sm group-hover:text-white transition-colors duration-200">PR #{activity.pr_number}</p>
                    <p className="text-gray-500 text-xs">{activity.formattedDate}</p>
                  </div>
                </div>
              ))}
              {stats.recentActivity.length === 0 && (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-400" />
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">This Month</span>
                  <span className="text-white font-semibold">{stats.reviewsThisMonth}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((stats.reviewsThisMonth / Math.max(stats.totalReviews, 1)) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-2 border-t border-gray-700">
                <div className="text-2xl font-bold text-white">{Object.keys(stats.dailyActivity).length}</div>
                <div className="text-gray-500 text-sm">Active days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <ReviewsList 
          reviews={reviews} 
          onSelectReview={setSelectedReview}
        />

        {/* Review Detail Modal */}
        {selectedReview && (
          <ReviewDetail 
            review={selectedReview} 
            onClose={() => setSelectedReview(null)}
          />
        )}
      </div>
    </div>
  )
}

export default App