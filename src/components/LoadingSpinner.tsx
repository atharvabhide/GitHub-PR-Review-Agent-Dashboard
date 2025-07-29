import React from 'react'

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <div className="w-12 h-12 border-4 border-gray-800 border-t-purple-500 rounded-full animate-spin absolute top-2 left-1/2 transform -translate-x-1/2 animate-pulse"></div>
        </div>
        <p className="text-white mt-4 text-lg">Loading dashboard...</p>
        <p className="text-gray-500 text-sm">Connecting to Supabase</p>
      </div>
    </div>
  )
}