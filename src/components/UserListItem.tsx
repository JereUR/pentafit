"use client"

import { Check, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { hasHealthConditions, isUserClient, SelectableUser } from "./health/healthUtils"
import { HealthWarningTooltip } from "./health/HealthWarningTooltip"

interface UserListItemProps {
  user: SelectableUser
  isSelected: boolean
  onToggle: () => void
  showHealthWarnings?: boolean
}

export function UserListItem({ user, isSelected, onToggle, showHealthWarnings = true }: UserListItemProps) {
  return (
    <div
      className={`
        flex items-center gap-2 p-2 rounded-md cursor-pointer
        ${isSelected ? "bg-primary/10" : "hover:bg-muted"}
      `}
      onClick={onToggle}
    >
      <div className="flex-shrink-0">
        {isSelected ? <Check className="h-5 w-5 text-primary" /> : <div className="h-5 w-5" />}
      </div>

      <Avatar className="h-8 w-8">
        <AvatarImage src={user.avatarUrl || undefined} alt={`${user.firstName} ${user.lastName}`} />
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 truncate">
        <div className="font-medium flex items-center gap-1">
          {user.firstName} {user.lastName}
          {hasHealthConditions(user, showHealthWarnings) && isUserClient(user) && <HealthWarningTooltip user={user} />}
        </div>
        {user.email && <div className="text-xs text-muted-foreground truncate">{user.email}</div>}
      </div>
    </div>
  )
}
