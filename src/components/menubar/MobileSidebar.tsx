"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { ClientNavContent } from "./ClientNavContent"

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="p-0 w-[280px] sm:w-[350px]">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>Application navigation menu with links to different sections of the app.</SheetDescription>
        </SheetHeader>
        <ClientNavContent isExpanded={true} onExpandedChange={() => { }} onClose={onClose} />
      </SheetContent>
    </Sheet>
  )
}
