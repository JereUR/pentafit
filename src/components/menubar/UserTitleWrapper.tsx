'use client'

import { useEffect, useState } from 'react'
import TopBar from '@/components/menubar/TopBar'
import { Loader2 } from 'lucide-react'

interface UserTitleWrapperProps {
  userId: string
  onMenuClick: () => void
}

export default function UserTitleWrapper({ userId, onMenuClick }: UserTitleWrapperProps) {
  const [userName, setUserName] = useState('')

  useEffect(() => {
    async function fetchUserName() {
      try {
        const response = await fetch(`/api/user/${userId}`)
        if (response.ok) {
          const user = await response.json()
          setUserName(`${user.firstName} ${user.lastName}`)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserName()
  }, [userId])

  if (userName === '') return <Loader2 className='animate-spin p-4' />

  return <TopBar userName={userName} onMenuClick={onMenuClick} />
}

