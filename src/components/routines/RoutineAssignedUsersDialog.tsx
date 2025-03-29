"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { UserClient } from "@/types/user"
import noImage from "@/assets/avatar-placeholder.png"

interface RoutineAssignedUsersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  users: UserClient[]
  routineName: string
}

export function RoutineAssignedUsersDialog({ open, onOpenChange, users, routineName }: RoutineAssignedUsersDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Usuarios asignados a {routineName}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 py-2">
            {users.length > 0 ? (
              users.map((user) => (
                <div key={user.id} className="flex items-center space-x-4 p-2 rounded-md hover:bg-secondary">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.avatarUrl || noImage.src}
                      alt={`${user.firstName} ${user.lastName} avatar`}
                    />
                    <AvatarFallback>
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-muted-foreground">No hay usuarios asignados a esta rutina</p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

