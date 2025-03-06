"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { navItems } from "@/config/nav"
import { Logo } from "./Logo"
import { ThemeToggle } from "../ThemeToggle"
import type { Role } from "@prisma/client"
import NavItemComponente from "./NavItemComponent"

interface NavContentProps {
  isExpanded: boolean
  onExpandedChange: (expanded: boolean) => void
  onClose: () => void
  userRole: Role
}

export function NavContent({ isExpanded, onExpandedChange, onClose, userRole }: NavContentProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggleSubmenu = (title: string) => {
    setOpenItems((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  const filteredNavItems = navItems.filter((item) => !item.roles || item.roles.includes(userRole))

  return (
    <div className="flex flex-col h-full">
      <div className="flex h-20 items-center border-b md:px-4">
        <Logo isExpanded={isExpanded} />
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto hidden lg:flex"
          onClick={() => onExpandedChange(!isExpanded)}
        >
          {isExpanded ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto space-y-2 p-2 scrollbar-thin">
        {filteredNavItems.map((item) => (
          <NavItemComponente
            key={item.title}
            item={item}
            isExpanded={isExpanded}
            isOpen={openItems[item.title]}
            onToggle={() => toggleSubmenu(item.title)}
            onClose={onClose}
          />
        ))}
      </nav>
      <div className="flex justify-center border-t p-4 mt-auto">
        <ThemeToggle isExpanded={isExpanded} />
      </div>
    </div>
  )
}

