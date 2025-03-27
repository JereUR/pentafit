"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import type { Role } from "@prisma/client"

import { cn } from "@/lib/utils"
import { AdminSidebar } from "@/components/menubar/AdminSidebar"
import TopBar from "@/components/menubar/TopBar"
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { AdminNavContent } from "@/components/menubar/AdminNavContent"
import UserTitleWrapper from "@/components/menubar/UserTitleWrapper"
import { WorkingFacilityProvider } from "@/contexts/WorkingFacilityContext"

interface AdminLayoutProps {
  children: React.ReactNode
  userRole: Role
}

export default function AdminLayout({ children, userRole }: AdminLayoutProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [initialNotificationCount, setInitialNotificationCount] = useState(0)

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const pathname = usePathname()
  const pathParts = pathname.split("/")

  const isUserPage = pathParts[1] === "usuarios" && pathParts[2]
  const isMembershipPage = pathParts[1] === "actualizar-membresia"
  const userId = isUserPage || isMembershipPage ? pathParts[2] : ""

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
    <WorkingFacilityProvider>
      <div className="relative h-screen bg-background overflow-hidden">
        <AdminSidebar isExpanded={isExpanded} onExpandedChange={setIsExpanded} userRole={userRole} />
        <div
          className={cn(
            "flex flex-col h-full transition-all duration-300",
            isExpanded ? "lg:ml-64" : "lg:ml-20",
          )}
        >
          {isUserPage || isMembershipPage ? (
            <UserTitleWrapper
              userId={userId}
              onMenuClick={toggleMobileMenu}
              initialNotificationCount={initialNotificationCount}
              userRole={userRole}
            />
          ) : (
            <TopBar
              onMenuClick={toggleMobileMenu}
              isLoading={false}
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
            <AdminNavContent
              isExpanded={true}
              onExpandedChange={setIsExpanded}
              onClose={closeMobileMenu}
              userRole={userRole}
            />
          </SheetContent>
        </Sheet>
      </div>
    </WorkingFacilityProvider>
  )
}