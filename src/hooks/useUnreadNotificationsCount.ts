"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import kyInstance from "@/lib/ky"

export function useUnreadNotificationCount() {
  const [initialCount, setInitialCount] = useState<number | null>(null)

  useEffect(() => {
    const fetchInitialCount = async () => {
      try {
        const response = await fetch("/api/notifications/unread-count")
        if (response.ok) {
          const data = await response.json()
          setInitialCount(data.unreadCount)
        }
      } catch (error) {
        console.error("Error fetching initial notification count:", error)
      }
    }

    fetchInitialCount()
  }, [])

  const {
    data: count,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["unread-notification-count"],
    queryFn: () =>
      kyInstance
        .get("/api/notifications/unread-count")
        .json<{ unreadCount: number }>(),
    initialData:
      initialCount !== null ? { unreadCount: initialCount } : undefined,
    enabled: initialCount !== null,
    refetchInterval: 60 * 1000,
  })

  return {
    count: count?.unreadCount ?? initialCount ?? 0,
    isLoading: isLoading || initialCount === null,
    error,
  }
}
