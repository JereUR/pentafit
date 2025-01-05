'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Sidebar } from '@/components/menubar/Sidebar'
import TopBar from '@/components/menubar/TopBar'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { NavContent } from '@/components/menubar/NavContent'
import UserTitleWrapper from '@/components/menubar/UserTitleWrapper'

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const pathname = usePathname()
  const pathParts = pathname.split('/')
  const isUserPage = pathParts[1] === 'usuarios' && pathParts[2]
  const userId = isUserPage ? pathParts[2] : ''

  return (
    <div className="relative h-screen bg-background overflow-hidden">
      <Sidebar isExpanded={isExpanded} onExpandedChange={setIsExpanded} />
      <div className={cn(
        "flex flex-col h-full transition-all duration-300",
        isExpanded ? "lg:ml-64" : "lg:ml-20"
      )}>
        {isUserPage ? (
          <UserTitleWrapper userId={userId} onMenuClick={toggleMobileMenu} />
        ) : (
          <TopBar onMenuClick={toggleMobileMenu} />
        )}
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-80 p-0 lg:hidden">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Access navigation links and options
          </SheetDescription>
          <NavContent isExpanded={true} onExpandedChange={setIsExpanded} />
        </SheetContent>
      </Sheet>
    </div>
  )
}

