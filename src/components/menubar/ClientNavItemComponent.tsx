"use client"

import Link from "next/link"
import { usePathname, useParams } from "next/navigation" // Add useParams
import { ChevronRight } from 'lucide-react'
import { useClientFacility } from "@/contexts/ClientFacilityContext"
import { CSSProperties } from "react"

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

function ClientNavItemComponent({ item, isExpanded, isOpen, onToggle, onClose }: NavItemProps) {
  const pathname = usePathname()
  const params = useParams()
  const facilityId = params?.facilityId as string
  const { primaryColor } = useClientFacility()

  const getFullHref = (href: string) => {
    if (!href) return '';
    if (href.startsWith('/')) {
      return `/${facilityId}${href}`;
    }
    return `/${facilityId}/${href}`;
  };

  const isActive = (itemHref: string) => {
    if (!itemHref) return false;
    const fullHref = getFullHref(itemHref);
    return pathname === fullHref;
  };

  const activeItemStyle: CSSProperties = isActive(item.href || '')
    ? { backgroundColor: primaryColor, color: "white" }
    : {};

  const activeSubItemStyle = (subItemHref: string): CSSProperties =>
    isActive(subItemHref)
      ? { backgroundColor: primaryColor, color: "white" }
      : {};

  const setHoverEffect = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    target.style.setProperty('--hover-color', primaryColor);
    target.classList.add('hover-active');
  };

  const removeHoverEffect = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    target.classList.remove('hover-active');
  };

  if (item.items) {
    return (
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <Button
            variant="noHover"
            className={cn(
              "w-full justify-start rounded-r-full text-sm md:text-base h-auto min-h-[2.5rem] py-2 relative overflow-hidden",
              !isExpanded && "lg:justify-center",
            )}
            style={{ ...activeItemStyle }}
            onMouseEnter={setHoverEffect}
            onMouseLeave={removeHoverEffect}
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
                "w-full justify-start pl-10 rounded-r-full first:mt-1 text-sm md:text-base h-auto min-h-[2.25rem] py-2 relative overflow-hidden",
                !isExpanded && "lg:hidden",
              )}
              style={activeSubItemStyle(subItem.href || "")}
              onMouseEnter={setHoverEffect}
              onMouseLeave={removeHoverEffect}
            >
              {subItem.href && (
                <Link
                  href={getFullHref(subItem.href)}
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
        "w-full justify-start rounded-r-full py-2 text-sm md:text-base h-auto min-h-[2.5rem] relative overflow-hidden",
        !isExpanded && "lg:justify-center",
      )}
      style={activeItemStyle}
      onMouseEnter={setHoverEffect}
      onMouseLeave={removeHoverEffect}
    >
      <Link
        href={getFullHref(item.href!)}
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

export default withClientSideRendering(ClientNavItemComponent)