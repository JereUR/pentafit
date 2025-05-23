"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { useClientFacility } from "@/contexts/ClientFacilityContext"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import type { NavItem } from "@/types/sidebar"
import { withClientSideRendering } from "@/hooks/withClientSideRendering"

interface NavItemProps {
  item: NavItem
  isExpanded: boolean
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
}

function NavItemComponent({ item, isExpanded, isOpen, onToggle, onClose }: NavItemProps) {
  const pathname = usePathname()
  const { primaryColor } = useClientFacility()

  const activeItemStyle = pathname === item.href ? { backgroundColor: primaryColor, color: "white" } : {}

  const activeSubItemStyle = (subItemHref: string) =>
    pathname === subItemHref ? { backgroundColor: primaryColor, color: "white" } : {}

  if (item.items) {
    return (
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <Button
            variant="noHover"
            className={cn(
              "w-full justify-start link-progress rounded-r-full text-sm md:text-base h-auto min-h-[2.5rem] py-2",
              !isExpanded && "lg:justify-center",
            )}
          >
            <item.icon className={cn("h-5 w-5", !isExpanded && "lg:mr-0")} />
            {(isExpanded || !isExpanded) && (
              <span className={cn("ml-2 whitespace-normal break-words leading-tight", !isExpanded && "lg:hidden")}>
                {item.title}
              </span>
            )}
            <ChevronRight
              className={cn("ml-auto h-5 w-5 transition-transform", isOpen && "rotate-90", !isExpanded && "lg:hidden")}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {item.items.map((subItem) => (
            <Button
              key={subItem.href}
              variant="noHover"
              asChild
              className={cn(
                "w-full justify-start pl-10 link-progress rounded-r-full first:mt-1 text-sm md:text-base h-auto min-h-[2.25rem] py-2",
                pathname === subItem.href && "bg-primary",
                !isExpanded && "lg:hidden",
              )}
              style={activeSubItemStyle(subItem.href || "")}
            >
              {subItem.href && (
                <Link
                  href={subItem.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onClose()
                    }
                  }}
                >
                  <span className="whitespace-normal break-words leading-tight block">{subItem.title}</span>
                </Link>
              )}
            </Button>
          ))}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <Button
      variant="noHover"
      asChild
      className={cn(
        "w-full justify-start link-progress rounded-r-full py-2 text-sm md:text-base h-auto min-h-[2.5rem]",
        pathname === item.href && "bg-primary",
        !isExpanded && "lg:justify-center",
      )}
      style={activeItemStyle}
    >
      <Link
        href={item.href!}
        onClick={() => {
          if (window.innerWidth < 1024) {
            onClose()
          }
        }}
      >
        <item.icon className={cn("h-5 w-5", !isExpanded && "lg:mr-0")} />
        <span className={cn("ml-2 whitespace-normal break-words leading-tight", !isExpanded && "lg:hidden")}>
          {item.title}
        </span>
      </Link>
    </Button>
  )
}

export default withClientSideRendering(NavItemComponent)

