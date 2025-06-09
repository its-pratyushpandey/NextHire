import React from 'react'
import { Crown } from 'lucide-react'
import { Badge } from './badge'
import { cn } from '@/lib/utils'

const PremiumBadge = ({ className }) => {
  return (
    <Badge 
      variant="secondary"
      className={cn(
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 gap-1",
        className
      )}
    >
      <Crown className="h-3 w-3 text-amber-500 animate-pulse" />
      Premium
    </Badge>
  )
}

export default PremiumBadge
