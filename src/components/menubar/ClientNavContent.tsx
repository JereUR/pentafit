"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useClientFacility } from "@/contexts/ClientFacilityContext"

import { Button } from "@/components/ui/button"
import { clientNavItems } from "@/config/client-nav-items"
import { ThemeToggle } from "../ThemeToggle"
import { LogoClient } from "./LogoClient"
import ClientNavItemComponent from "./ClientNavItemComponent"

interface ClientNavContentProps {
  isExpanded: boolean
  onExpandedChange: (expanded: boolean) => void
  onClose: () => void
}

export function ClientNavContent({ isExpanded, onExpandedChange, onClose }: ClientNavContentProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})
  const { primaryColor } = useClientFacility()

  const toggleSubmenu = (title: string) => {
    setOpenItems((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex h-20 items-center border-b md:px-4"
      >
        <LogoClient isExpanded={isExpanded} />
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto hidden lg:flex"
          onClick={() => onExpandedChange(!isExpanded)}
          style={{ color: primaryColor }}
        >
          {isExpanded ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto space-y-2 p-2 scrollbar-thin">
        {clientNavItems.map((item) => (
          <ClientNavItemComponent
            key={item.title}
            item={item}
            isExpanded={isExpanded}
            isOpen={openItems[item.title]}
            onToggle={() => toggleSubmenu(item.title)}
            onClose={onClose}
          />
        ))}
      </nav>
      <div
        className="flex justify-center border-t p-4 mt-auto"
      >
        <ThemeToggle isExpanded={isExpanded} primaryColor={primaryColor} />
      </div>
    </div>
  )
}