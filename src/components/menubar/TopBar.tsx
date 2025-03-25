"use client"

import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import UserButton from "../UserButton"
import TopBarSkeleton from "../skeletons/TopBarSkeleton"
import { usePageTitle } from "@/hooks/usePageTitle"
import NotificationsButton from "../home/NotificationsButton"

interface TopBarProps {
  onMenuClick: () => void
  userName?: string
  isLoading?: boolean
  initialNotificationCount: number
  facilityName?: string
}

export default function TopBar({
  onMenuClick,
  userName,
  isLoading = false,
  initialNotificationCount,
  facilityName,
}: TopBarProps) {
  const { title: pageTitle, isLoading: isTitleLoading } = usePageTitle(userName)

  const displayTitle = facilityName || pageTitle

  if (isLoading || isTitleLoading) {
    return <TopBarSkeleton />
  }

  return (
    <div className="sticky top-0 z-30 flex justify-between items-center shadow-md p-5 w-full transition-all duration-300 ease-in-out bg-background">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
        <div className="text-foreground font-bold capitalize text-lg md:text-2xl">{displayTitle}</div>
      </div>
      <div className="flex items-center gap-5 md:mr-10">
        <UserButton />
        <NotificationsButton initialState={{ unreadCount: initialNotificationCount }} />
      </div>
    </div>
  )
}

