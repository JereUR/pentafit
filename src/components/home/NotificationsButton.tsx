"use client"

import { Bell } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import kyInstance from "@/lib/ky"
import type { NotificationCountInfo } from "@/types/notification"
import NotificationsDropdown from "./NotificationsDropdown"

interface NotificationsButtonProps {
  initialState: NotificationCountInfo
  primaryColor?: string
}

export default function NotificationsButton({ initialState, primaryColor }: NotificationsButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { data } = useQuery({
    queryKey: ["unread-notification-count"],
    queryFn: () => kyInstance.get("/api/notifications/unread-count").json<NotificationCountInfo>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  })

  const toggleDropdown = () => setIsOpen(!isOpen)

  const formatCount = (count: number) => {
    if (count > 999) return "999+"
    if (count > 99) return "99+"
    return count.toString()
  }

  return (
    <NotificationsDropdown
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      primaryColor={primaryColor}
      trigger={
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full p-0"
          title="Notificaciones"
          onClick={toggleDropdown}
        >
          <div className="flex h-full w-full items-center justify-center bg-secondary rounded-full">
            <Bell className="h-5 w-5 text-foreground" />
          </div>
          {!!data.unreadCount && (
            <span
              className="absolute -right-2 -top-2 flex min-w-[1.25rem] min-h-[1.25rem] items-center justify-center rounded-full px-1 text-xs font-medium text-primary-foreground"
              style={primaryColor ? { backgroundColor: primaryColor } : {}}
            >
              {formatCount(data.unreadCount)}
            </span>
          )}
        </Button>
      }
    />
  )
}