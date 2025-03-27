"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { ClientSidebar } from "@/components/menubar/ClientSidebar"
import ClientTopBar from "@/components/menubar/ClientTopBar"
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { ClientNavContent } from "@/components/menubar/ClientNavContent"
import UserTitleWrapper from "@/components/menubar/UserTitleWrapper"
import { ClientFacilityProvider } from "@/contexts/ClientFacilityContext"
import { Role } from "@prisma/client"

interface ClientLayoutProps {
  children: React.ReactNode
  userRole: Role
}

export default function ClientLayout({ children, userRole }: ClientLayoutProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [initialNotificationCount, setInitialNotificationCount] = useState(0)

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const pathname = usePathname()
  const pathParts = pathname.split("/")

  const isUserPage = pathParts[1] === "usuarios" && pathParts[2]
  const userId = isUserPage ? pathParts[2] : ""
  const isMyFacilitiesPage = pathParts[1] === "mis-establecimientos"

  useEffect(() => {
    async function fetchInitialNotificationCount() {
      try {
        const response = await fetch("/api/notifications/unread-count")
        if (response.ok) {
          const data = await response.json()
          setInitialNotificationCount(data.unreadCount)
        }
      } catch (error) {
        console.error("Error fetching initial notification count:", error)
      }
    }

    fetchInitialNotificationCount()
  }, [])

  return (
    <ClientFacilityProvider>
      <div className="relative h-screen bg-background overflow-hidden">
        {!isMyFacilitiesPage && (
          <ClientSidebar isExpanded={isExpanded} onExpandedChange={setIsExpanded} userRole={userRole} />
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
              initialNotificationCount={initialNotificationCount}
              userRole={userRole}
            />
          ) : (
            <ClientTopBar
              onMenuClick={toggleMobileMenu}
              initialNotificationCount={initialNotificationCount}
              userRole={userRole}
            />
          )}
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 max-w-full scrollbar-thin">{children}</main>
        </div>

        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="w-80 p-0 lg:hidden">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">Access navigation links and options</SheetDescription>
            <ClientNavContent
              isExpanded={true}
              onExpandedChange={setIsExpanded}
              onClose={closeMobileMenu}
            />
          </SheetContent>
        </Sheet>
      </div>
    </ClientFacilityProvider>
  )
}