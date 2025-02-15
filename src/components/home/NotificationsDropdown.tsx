"use client"

import type React from "react"

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Notifications from "./Notifications"

interface NotificationsDropdownProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  trigger: React.ReactNode
}

export default function NotificationsDropdown({ isOpen, onOpenChange, trigger }: NotificationsDropdownProps) {
  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-[350px] max-h-[80vh] overflow-y-auto scrollbar-thin" align="end">
        <Notifications />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

