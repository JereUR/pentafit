'use client'

import { useState } from 'react'

import { cn } from '@/lib/utils'
import { Sidebar } from '@/components/sidebar/Sidebar'

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isExpanded={isExpanded} onExpandedChange={setIsExpanded} />
      <main className={cn(
        "flex-1 overflow-auto transition-all duration-300",
        isExpanded ? "lg:ml-64" : "lg:ml-16"
      )}>
        {children}
      </main>
    </div>
  )
}

