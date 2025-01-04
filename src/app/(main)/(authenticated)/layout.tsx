'use client'

import { useState } from 'react'

import { cn } from '@/lib/utils'
import { Sidebar } from '@/components/menubar/Sidebar'
import TopBar from '@/components/menubar/TopBar'

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="relative h-screen bg-background overflow-hidden">
      <Sidebar isExpanded={isExpanded} onExpandedChange={setIsExpanded} />
      <div className={cn(
        "flex flex-col h-full transition-all duration-300",
        isExpanded ? "lg:ml-64" : "lg:ml-20"
      )}>
        <TopBar />
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  )
}
