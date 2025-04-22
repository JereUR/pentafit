"use client"

import { useState } from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { SelectableUser } from "./health/healthUtils"
import { UserListItem } from "./UserListItem"

interface SelectUsersProps {
  users: SelectableUser[]
  selectedUserIds: string[]
  onChange: (selectedIds: string[]) => void
  showHealthWarnings?: boolean
}

export function SelectUsers({ users, selectedUserIds, onChange, showHealthWarnings = true }: SelectUsersProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleUser = (userId: string) => {
    const newSelected = selectedUserIds.includes(userId)
      ? selectedUserIds.filter((id) => id !== userId)
      : [...selectedUserIds, userId]
    onChange(newSelected)
  }

  return (
    <div className="space-y-2">
      <Input placeholder="Buscar usuarios..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

      <ScrollArea className="h-60 border rounded-md">
        {filteredUsers.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">No se encontraron usuarios</div>
        ) : (
          <div className="p-1">
            {filteredUsers.map((user) => (
              <UserListItem
                key={user.id}
                user={user}
                isSelected={selectedUserIds.includes(user.id)}
                onToggle={() => toggleUser(user.id)}
                showHealthWarnings={showHealthWarnings}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="text-xs text-muted-foreground">{selectedUserIds.length} usuarios seleccionados</div>
    </div>
  )
}
