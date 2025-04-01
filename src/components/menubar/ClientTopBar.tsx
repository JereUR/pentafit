"use client"

import { Menu } from 'lucide-react'
import { useClientFacility } from "@/contexts/ClientFacilityContext"

import { Button } from "@/components/ui/button"
import UserButton from "../UserButton"
import TopBarSkeleton from "../skeletons/TopBarSkeleton"
import { usePageTitle } from "@/hooks/usePageTitle"
import NotificationsButton from "../home/NotificationsButton"
import { Role } from '@prisma/client'
import { usePathname } from 'next/navigation'

interface ClientTopBarProps {
  onMenuClick: () => void
  userName?: string
  initialNotificationCount: number
  userRole: Role
}

export default function ClientTopBar({
  onMenuClick,
  userName,
  initialNotificationCount,
  userRole
}: ClientTopBarProps) {
  const { facility, primaryColor, isLoading: isFacilityLoading } = useClientFacility()
  const { title: pageTitle, isLoading: isTitleLoading } = usePageTitle(userName)
  const pathname = usePathname()
  const pathParts = pathname.split("/")

  const isMyFacilitiesPage = pathParts[1] === "mis-establecimientos"

  const displayTitle = !isMyFacilitiesPage ? `${facility?.name} - ${pageTitle}` : `${pageTitle}`

  if (isFacilityLoading || isTitleLoading) {
    return <TopBarSkeleton primaryColor={primaryColor} />
  }

  return (
    <div
      className="sticky top-0 z-30 flex justify-between items-center shadow-md p-5 w-full transition-all duration-300 ease-in-out bg-background"
    >
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
        <div className="text-foreground font-bold capitalize text-lg md:text-2xl">{displayTitle}</div>
      </div>
      <div className="flex items-center gap-5 md:mr-10">
        <UserButton userRole={userRole} facilityId={facility?.id} primaryColor={primaryColor} />
        <NotificationsButton initialState={{ unreadCount: initialNotificationCount }} />
      </div>
    </div>
  )
}