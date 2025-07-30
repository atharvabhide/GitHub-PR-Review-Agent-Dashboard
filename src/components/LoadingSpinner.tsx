import React from 'react'

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#30363d] border-t-[#1f6feb] rounded-full animate-spin mx-auto"></div>
          <div className="w-12 h-12 border-4 border-[#21262d] border-t-[#238636] rounded-full animate-spin absolute top-2 left-1/2 transform -translate-x-1/2 animate-pulse"></div>
        </div>
        <p className="text-[#f0f6fc] mt-4 text-lg">Loading dashboard...</p>
        <p className="text-[#7d8590] text-sm">Connecting to Supabase</p>
      </div>
    </div>
  )
}