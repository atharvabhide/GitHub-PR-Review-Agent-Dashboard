import { useState, useEffect } from 'react'
import { supabase, type PRReview } from '../lib/supabase'

export function usePRReviews() {
  const [reviews, setReviews] = useState<PRReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(
    !supabase ? 'Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file.' : null
  )

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    fetchReviews()
    
    // Set up real-time subscription
    const channel = supabase
      .channel('github_pr_review_agent_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'GitHub PR Review Agent' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setReviews(prev => [payload.new as PRReview, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setReviews(prev => prev.filter(review => review.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            setReviews(prev => prev.map(review => 
              review.id === payload.new.id ? payload.new as PRReview : review
            ))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchReviews() {
    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      setLoading(true)
      const { data, error } = await supabase
        .from('GitHub PR Review Agent')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setReviews(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return { reviews, loading, error, refetch: fetchReviews }
}