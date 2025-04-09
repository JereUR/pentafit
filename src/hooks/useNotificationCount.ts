"use client"

import { useState, useEffect } from "react"

export function useNotificationCount() {
  const [notificationCount, setNotificationCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchNotificationCount() {
      setLoading(true)
      try {
        const response = await fetch("/api/notifications/unread-count")
        if (!response.ok) {
          throw new Error("Failed to fetch notification count")
        }
        const data = await response.json()
        setNotificationCount(data.unreadCount)
        setError(null)
      } catch (err) {
        console.error("Error fetching notification count:", err)
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setLoading(false)
      }
    }

    fetchNotificationCount()
  }, [])

  return { notificationCount, loading, error }
}
