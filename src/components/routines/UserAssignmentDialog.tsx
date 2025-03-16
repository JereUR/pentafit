"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAllClients } from "@/hooks/useAllClients"
import { Loader2 } from "lucide-react"
import { useAssignRoutineToUsersMutation } from "@/app/(main)/(authenticated)/entrenamiento/rutinas/mutations"
import { SelectUsers } from "../ui/select-users"

interface UserAssignmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  routineId: string
  routineName: string
  facilityId: string
}

export function UserAssignmentDialog({
  open,
  onOpenChange,
  routineId,
  routineName,
  facilityId,
}: UserAssignmentDialogProps) {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const { data: clients = [], isLoading } = useAllClients(facilityId)
  const { mutate: assignRoutineToUsers, isPending } = useAssignRoutineToUsersMutation()

  useEffect(() => {
    if (!open) {
      setSelectedUserIds([])
    }
  }, [open])

  const handleAssign = () => {
    if (selectedUserIds.length === 0) return

    assignRoutineToUsers(
      {
        routineId,
        userIds: selectedUserIds,
        facilityId,
      },
      {
        onSuccess: () => {
          setSelectedUserIds([])
          onOpenChange(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Asignar rutina a usuarios</DialogTitle>
          <DialogDescription>
            Selecciona los usuarios a los que deseas asignar la rutina <strong>{routineName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No hay usuarios disponibles</div>
          ) : (
            <SelectUsers users={clients} selectedUserIds={selectedUserIds} onChange={setSelectedUserIds} />
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSelectedUserIds([])
              onOpenChange(false)
            }}
          >
            Cancelar
          </Button>
          <Button type="button" onClick={handleAssign} disabled={selectedUserIds.length === 0 || isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Asignar {selectedUserIds.length > 0 && `(${selectedUserIds.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

