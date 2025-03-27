"use client"

import { useEffect, useState } from "react"
import TopBar from "@/components/menubar/TopBar"
import { Role } from "@prisma/client"

interface UserTitleWrapperProps {
  userId: string
  onMenuClick: () => void
  initialNotificationCount: number
  userRole: Role
}

export default function UserTitleWrapper({ userId, onMenuClick, initialNotificationCount, userRole }: UserTitleWrapperProps) {
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUserName() {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/user/${userId}`)
        if (response.ok) {
          const user = await response.json()
          setUserName(`${user.firstName} ${user.lastName}`)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserName()
  }, [userId])

  return (
    <TopBar
      userName={userName}
      onMenuClick={onMenuClick}
      isLoading={isLoading}
      initialNotificationCount={initialNotificationCount}
      userRole={userRole}
    />
  )
}

