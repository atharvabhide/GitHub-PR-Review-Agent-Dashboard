import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  icon?: React.ReactNode
}

export function StatCard({ title, value, subtitle, trend, trendValue, icon }: StatCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />
      default: return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-500'
      case 'down': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className="bg-[#161b22] rounded-xl p-6 border border-[#30363d] hover:border-[#656d76] transition-all duration-300 hover:shadow-lg hover:shadow-[#1f6feb]/10 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#7d8590] text-sm font-medium">{title}</h3>
        {icon && <div className="text-[#1f6feb] opacity-80">{icon}</div>}
      </div>
      
      <div className="space-y-2">
        <div className="text-3xl font-bold text-[#f0f6fc]">{value}</div>
        
        {(subtitle || trend) && (
          <div className="flex items-center justify-between">
            {subtitle && <p className="text-[#7d8590] text-sm">{subtitle}</p>}
            {trend && trendValue && (
              <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="text-sm font-medium">{trendValue}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}