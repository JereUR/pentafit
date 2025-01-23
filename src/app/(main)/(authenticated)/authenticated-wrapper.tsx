"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import type { Role } from "@prisma/client"

import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/menubar/Sidebar"
import TopBar from "@/components/menubar/TopBar"
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { NavContent } from "@/components/menubar/NavContent"
import UserTitleWrapper from "@/components/menubar/UserTitleWrapper"
import { WorkingFacilityProvider } from "@/contexts/WorkingFacilityContext"

interface AuthenticatedLayoutProps {
  children: React.ReactNode
  userRole: Role
}

export default function AuthenticatedLayout({ children, userRole }: AuthenticatedLayoutProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const pathname = usePathname()
  const pathParts = pathname.split("/")
  const isUserPage = pathParts[1] === "usuarios" && pathParts[2]
  const isMembershipPage = pathParts[1] === "actualizar-membresia"
  const userId = isUserPage || isMembershipPage ? pathParts[2] : ""

  return (
    <WorkingFacilityProvider>
      <div className="relative h-screen bg-background overflow-hidden">
        <Sidebar isExpanded={isExpanded} onExpandedChange={setIsExpanded} userRole={userRole} />
        <div className={cn("flex flex-col h-full transition-all duration-300", isExpanded ? "lg:ml-64" : "lg:ml-20")}>
          {isUserPage || isMembershipPage ? (
            <UserTitleWrapper userId={userId} onMenuClick={toggleMobileMenu} />
          ) : (
            <TopBar onMenuClick={toggleMobileMenu} isLoading={false} />
          )}
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </div>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="w-80 p-0 lg:hidden">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">Access navigation links and options</SheetDescription>
            <NavContent
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

