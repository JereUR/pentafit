"use client"

import { cn } from "@/lib/utils"
import type { SidebarProps } from "@/types/sidebar"
import { AdminNavContent } from "./AdminNavContent"

export function AdminSidebar({ isExpanded, onExpandedChange, userRole }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full border-r bg-background z-40",
        isExpanded ? "w-64" : "w-20",
        "transition-all duration-300 hidden lg:block",
      )}
    >
      <AdminNavContent
        isExpanded={isExpanded}
        onExpandedChange={onExpandedChange}
        onClose={() => { }}
        userRole={userRole}
      />
    </aside>
  )
}

