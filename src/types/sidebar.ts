import type { LucideIcon } from "lucide-react"
import type { Role } from "@prisma/client"

export interface NavItem {
  title: string
  icon: LucideIcon | React.FC
  href?: string
  items?: Omit<NavItem, "icon">[]
  roles?: Role[]
}

export interface SidebarProps {
  isExpanded: boolean
  onExpandedChange: (expanded: boolean) => void
}
