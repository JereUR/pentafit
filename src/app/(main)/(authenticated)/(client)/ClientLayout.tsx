"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { ClientSidebar } from "@/components/menubar/ClientSidebar"
import ClientTopBar from "@/components/menubar/ClientTopBar"
import UserTitleWrapper from "@/components/menubar/UserTitleWrapper"
import { useClientFacility } from "@/contexts/ClientFacilityContext"
import type { Role } from "@prisma/client"
import { MobileBottomNav } from "@/components/menubar/MobileBottomNav"
import { MobileSidebar } from "@/components/menubar/MobileSidebar"
import { useNotificationCount } from "@/hooks/useNotificationCount"

interface ClientLayoutProps {
  children: React.ReactNode
  userRole: Role
}

export default function ClientLayout({ children, userRole }: ClientLayoutProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { notificationCount } = useNotificationCount()
  const { primaryColor } = useClientFacility()

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const pathname = usePathname()
  const pathParts = pathname.split("/")

  const isUserPage = pathParts[1] === "usuarios" && pathParts[2]
  const userId = isUserPage ? pathParts[2] : ""
  const isMyFacilitiesPage = pathParts[1] === "mis-establecimientos"

  useEffect(() => {
    if (primaryColor) {
      document.documentElement.style.setProperty("--scrollbar-thumb-color", primaryColor)
    }
  }, [primaryColor])

  return (
    <div className="relative h-screen bg-background overflow-hidden">
      {!isMyFacilitiesPage && (
        <ClientSidebar isExpanded={isExpanded} onExpandedChange={setIsExpanded} userRole={userRole} />
      )}
      {!isMyFacilitiesPage && (
        <MobileSidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      )}
      <div
        className={cn(
          "flex flex-col h-full transition-all duration-300",
          isMyFacilitiesPage ? "" : isExpanded ? "lg:ml-64" : "lg:ml-20",
        )}
      >
        {isUserPage ? (
          <UserTitleWrapper
            userId={userId}
            onMenuClick={toggleMobileMenu}
            initialNotificationCount={notificationCount}
            userRole={userRole}
          />
        ) : (
          <ClientTopBar
            onMenuClick={toggleMobileMenu}
            initialNotificationCount={notificationCount}
            userRole={userRole}
          />
        )}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-2 lg:p-4 max-w-full scrollbar-thin pb-20 lg:pb-4">
          {children}
        </main>
      </div>
      {!isMyFacilitiesPage && <MobileBottomNav />}
    </div>
  )
}
