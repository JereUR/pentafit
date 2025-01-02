'use client'

import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import type { SidebarProps } from '@/types/sidebar'
import { NavContent } from './NavContent'

export function Sidebar({ isExpanded, onExpandedChange }: SidebarProps) {
  return (
    <>
      <aside
        className={cn(
          "fixed hidden h-full border-r bg-background lg:flex lg:flex-col",
          isExpanded ? "w-64" : "w-20",
          "transition-all duration-300"
        )}
      >
        <NavContent isExpanded={isExpanded} onExpandedChange={onExpandedChange} />
      </aside>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <NavContent isExpanded={true} onExpandedChange={onExpandedChange} />
        </SheetContent>
      </Sheet>
    </>
  )
}

