"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import type { UserClient } from "@/types/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"

interface SelectUsersProps {
  users: UserClient[]
  selectedUserIds: string[]
  onChange: (selectedIds: string[]) => void
}

export function SelectUsers({ users, selectedUserIds, onChange }: SelectUsersProps) {
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
              <div
                key={user.id}
                className={`
                  flex items-center gap-2 p-2 rounded-md cursor-pointer
                  ${selectedUserIds.includes(user.id) ? "bg-primary/10" : "hover:bg-muted"}
                `}
                onClick={() => toggleUser(user.id)}
              >
                <div className="flex-shrink-0">
                  {selectedUserIds.includes(user.id) ? (
                    <Check className="h-5 w-5 text-primary" />
                  ) : (
                    <div className="h-5 w-5" />
                  )}
                </div>

                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatarUrl || undefined} alt={`${user.firstName} ${user.lastName}`} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 truncate">
                  <div className="font-medium">
                    {user.firstName} {user.lastName}
                  </div>
                  {user.email && <div className="text-xs text-muted-foreground truncate">{user.email}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="text-xs text-muted-foreground">{selectedUserIds.length} usuarios seleccionados</div>
    </div>
  )
}

