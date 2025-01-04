'use client'

import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import type { SidebarProps } from '@/types/sidebar'
import { NavContent } from './NavContent'

export function Sidebar({ isExpanded, onExpandedChange }: SidebarProps) {
  return (
    <>
      <aside className={cn(
        "fixed left-0 top-0 h-full border-r bg-background z-40",
        isExpanded ? "w-64" : "w-20",
        "transition-all duration-300 hidden lg:block"
      )}>
        <NavContent isExpanded={isExpanded} onExpandedChange={onExpandedChange} />
      </aside>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed left-4 top-4 z-50">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Access navigation links and options
          </SheetDescription>
          <NavContent isExpanded={true} onExpandedChange={onExpandedChange} />
        </SheetContent>
      </Sheet>
    </>
  )
}

