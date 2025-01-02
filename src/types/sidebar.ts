import { type LucideIcon } from "lucide-react"

export interface NavItem {
  title: string
  icon: LucideIcon
  href?: string
  items?: { title: string; href: string }[]
}

export interface SidebarProps {
  isExpanded: boolean
  onExpandedChange: (expanded: boolean) => void
}
