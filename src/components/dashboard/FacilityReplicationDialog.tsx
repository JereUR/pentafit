import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FacilityInfo {
  id: string
  name: string
  logoUrl?: string
}

interface FacilityReplicationDialogProps {
  isOpen: boolean
  onClose: () => void
  facilities: FacilityInfo[]
  title?: string
}

export function FacilityReplicationDialog({
  isOpen,
  onClose,
  facilities,
  title = "Establecimientos replicados",
}: FacilityReplicationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 py-2">
            {facilities.length > 0 ? (
              facilities.map((facility) => (
                <div key={facility.id} className="flex items-center space-x-4 p-2 rounded-md hover:bg-secondary">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={facility.logoUrl} alt={facility.name} />
                    <AvatarFallback>{facility.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{facility.name}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-muted-foreground">No hay establecimientos para mostrar</p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

