"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Notifications from "./Notifications"

interface NotificationsDropdownProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  primaryColor?: string
  trigger: React.ReactNode
}

export default function NotificationsDropdown({ isOpen, onOpenChange, trigger, primaryColor }: NotificationsDropdownProps) {
  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-[350px] max-h-[80vh] overflow-y-auto scrollbar-thin" align="end">
        <Notifications primaryColor={primaryColor} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

