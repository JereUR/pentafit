"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

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
import { useAssignedNutritionalPlanUsers } from "@/hooks/useAssignedNutritionalPlanUsers"
import { SelectUsers } from "../ui/select-users"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useAssignNutritionalPlanToUsersMutation, useUnassignNutritionalPlanFromUsersMutation } from "@/app/(main)/(authenticated)/entrenamiento/planes-nutricionales/mutations"

interface UserAssignmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  nutritionalPlanId: string
  nutritionalPlanName: string
  facilityId: string
}

export function UserAssignmentDialog({
  open,
  onOpenChange,
  nutritionalPlanId,
  nutritionalPlanName,
  facilityId,
}: UserAssignmentDialogProps) {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<"assign" | "unassign">("assign")

  const { data: clients = [], isLoading: isLoadingClients } = useAllClients(facilityId)
  const { data: assignedUsers = [], isLoading: isLoadingAssigned } = useAssignedNutritionalPlanUsers(nutritionalPlanId)

  const { mutate: assignNutritionalPlanToUsers, isPending: isAssigning } = useAssignNutritionalPlanToUsersMutation()
  const { mutate: unassignNutritionalPlanFromUsers, isPending: isUnassigning } =
    useUnassignNutritionalPlanFromUsersMutation()

  const unassignedClients = clients.filter((client) => !assignedUsers.some((assigned) => assigned.id === client.id))

  useEffect(() => {
    if (!open) {
      setSelectedUserIds([])
      setActiveTab("assign")
    }
  }, [open])

  const handleAssign = () => {
    if (selectedUserIds.length === 0) return

    assignNutritionalPlanToUsers(
      {
        nutritionalPlanId,
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

  const handleUnassign = () => {
    if (selectedUserIds.length === 0) return

    unassignNutritionalPlanFromUsers(
      {
        nutritionalPlanId,
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

  const isLoading = activeTab === "assign" ? isLoadingClients : isLoadingAssigned
  const isPending = activeTab === "assign" ? isAssigning : isUnassigning
  const availableUsers = activeTab === "assign" ? unassignedClients : assignedUsers
  const handleAction = activeTab === "assign" ? handleAssign : handleUnassign

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gestionar asignaciones de plan nutricional</DialogTitle>
          <DialogDescription>
            Gestiona los usuarios asignados al plan nutricional <strong>{nutritionalPlanName}</strong>
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as "assign" | "unassign")
            setSelectedUserIds([])
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assign">Asignar usuarios</TabsTrigger>
            <TabsTrigger value="unassign">Desasignar usuarios</TabsTrigger>
          </TabsList>

          <TabsContent value="assign">
            <div className="py-4">
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : availableUsers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No hay usuarios disponibles para asignar</div>
              ) : (
                <SelectUsers users={availableUsers} selectedUserIds={selectedUserIds} onChange={setSelectedUserIds} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="unassign">
            <div className="py-4">
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : availableUsers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No hay usuarios asignados a este plan nutricional
                </div>
              ) : (
                <SelectUsers users={availableUsers} selectedUserIds={selectedUserIds} onChange={setSelectedUserIds} />
              )}
            </div>
          </TabsContent>
        </Tabs>

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
          <Button
            type="button"
            onClick={handleAction}
            disabled={selectedUserIds.length === 0 || isPending}
            variant={activeTab === "unassign" ? "destructive" : "default"}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {activeTab === "assign" ? "Asignar" : "Desasignar"}{" "}
            {selectedUserIds.length > 0 && `(${selectedUserIds.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

