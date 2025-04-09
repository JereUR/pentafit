"use client"

import Link from "next/link"
import { usePathname, useParams } from "next/navigation"

import { clientNavItems } from "@/config/client-nav-items"
import { useClientFacility } from "@/contexts/ClientFacilityContext"
import { cn } from "@/lib/utils"

export function MobileBottomNav() {
  const pathname = usePathname()
  const params = useParams()
  const facilityId = params?.facilityId as string
  const { primaryColor } = useClientFacility()

  const getFullHref = (href: string) => {
    if (!href) return ""
    if (href.startsWith("/")) {
      return `/${facilityId}${href}`
    }
    return `/${facilityId}/${href}`
  }

  const isActive = (itemHref: string) => {
    if (!itemHref) return false
    const fullHref = getFullHref(itemHref)
    return pathname === fullHref
  }

  const bottomNavItems = clientNavItems
    .filter(
      (item) =>
        !item.items &&
        item.title !== "Pagos" &&
        item.href,
    )
    .slice(0, 5)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t lg:hidden">
      <div className="flex justify-around items-center h-16">
        {bottomNavItems.map((item) => {
          const active = isActive(item.href || "")
          const displayTitle = item.title === "Mi Plan Nutricional" ? "Nutrición" : item.title

          return (
            <Link
              key={item.title}
              href={getFullHref(item.href || "")}
              className={cn("flex flex-col items-center justify-center w-full h-full", active && "text-primary")}
              style={{ color: active ? primaryColor : undefined }}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1 text-center">{displayTitle}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
