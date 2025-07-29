import { useMemo } from 'react'
import { format, startOfDay, startOfWeek, startOfMonth, isAfter } from 'date-fns'
import { type PRReview } from '../lib/supabase'

export function useStats(reviews: PRReview[]) {
  return useMemo(() => {
    const now = new Date()
    const today = startOfDay(now)
    const thisWeek = startOfWeek(now)
    const thisMonth = startOfMonth(now)

    const totalReviews = reviews.length
    const reviewsToday = reviews.filter(r => isAfter(new Date(r.created_at), today)).length
    const reviewsThisWeek = reviews.filter(r => isAfter(new Date(r.created_at), thisWeek)).length
    const reviewsThisMonth = reviews.filter(r => isAfter(new Date(r.created_at), thisMonth)).length

    const avgReviewLength = reviews.length > 0 
      ? Math.round(reviews.reduce((sum, r) => sum + r.review_body.length, 0) / reviews.length)
      : 0

    const prCounts = reviews.reduce((acc, review) => {
      acc[review.pr_number] = (acc[review.pr_number] || 0) + 1
      return acc
    }, {} as Record<number, number>)

    const topPRs = Object.entries(prCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([prNumber, count]) => ({ prNumber: parseInt(prNumber), count }))

    const recentActivity = reviews
      .slice(0, 10)
      .map(review => ({
        ...review,
        formattedDate: format(new Date(review.created_at), 'MMM dd, HH:mm')
      }))

    const dailyActivity = reviews.reduce((acc, review) => {
      const date = format(new Date(review.created_at), 'MMM dd')
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalReviews,
      reviewsToday,
      reviewsThisWeek,
      reviewsThisMonth,
      avgReviewLength,
      topPRs,
      recentActivity,
      dailyActivity
    }
  }, [reviews])
}