import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserClient } from "@/types/user"
import noImage from '@/assets/no-image.png'

interface UserAssignmentDialogProps {
  isOpen: boolean
  onClose: () => void
  users: UserClient[]
  title?: string
}

export function UserAssignmentDialog({
  isOpen,
  onClose,
  users,
  title = "Usuarios asignados",
}: UserAssignmentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 py-2">
            {users.length > 0 ? (
              users.map((user) => (
                <div key={user.id} className="flex items-center space-x-4 p-2 rounded-md hover:bg-secondary">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatarUrl || noImage.src} alt={`${user.firstName} ${user.lastName} avatar`} />
                    <AvatarFallback>{user.email}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-muted-foreground">No hay usuarios para mostrar</p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

