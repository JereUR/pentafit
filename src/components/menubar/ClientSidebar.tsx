"use client"

import { cn } from "@/lib/utils"
import type { SidebarProps } from "@/types/sidebar"
import { ClientNavContent } from "./ClientNavContent"
import { useClientFacility } from "@/contexts/ClientFacilityContext"
import { useEffect, useState } from "react"

export function ClientSidebar({ isExpanded, onExpandedChange }: SidebarProps) {
  const { primaryColor, isLoading } = useClientFacility()
  const [borderColor, setBorderColor] = useState("transparent")

  useEffect(() => {
    if (!isLoading) {
      console.log("Setting border color with primaryColor:", primaryColor)
      setBorderColor(`${primaryColor}40`)
    }
  }, [primaryColor, isLoading])

  console.log("ClientSidebar rendering with:", { primaryColor, isLoading, borderColor })

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full border-r bg-background z-40",
        isExpanded ? "w-64" : "w-20",
        "transition-all duration-300 hidden lg:block",
      )}
      style={{
        borderRightColor: borderColor,
      }}
    >
      <ClientNavContent isExpanded={isExpanded} onExpandedChange={onExpandedChange} onClose={() => {}} />
    </aside>
  )
}

