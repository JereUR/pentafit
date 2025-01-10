'use client'

import { useEffect, useState } from 'react'
import TopBar from '@/components/menubar/TopBar'

interface UserTitleWrapperProps {
  userId: string
  userPage: boolean
  onMenuClick: () => void
}

export default function UserTitleWrapper({ userId, userPage, onMenuClick }: UserTitleWrapperProps) {
  const [userName, setUserName] = useState('')
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

  return <TopBar userName={userName} onMenuClick={onMenuClick} userPage={userPage} isLoading={isLoading} />
}

