"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, Info, Users } from "lucide-react"
import type { UseMutateFunction } from "@tanstack/react-query"

import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { type PlanData, columnsPlans } from "@/types/plan"
import { cn } from "@/lib/utils"
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogPortal, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DiaryPlansDialog } from "./DiaryPlansDialog"
import { PlanUserAssignmentDialog } from "./PlanUserAssignmentDialog"
import { PlanAssignedUsersDialog } from "./PlanAssignedUsersDialog"

interface PlanRowProps {
  plan: PlanData
  index: number
  visibleColumns: Set<keyof PlanData>
  isSelected: boolean
  onToggleRow: (id: string) => void
  deletePlan: UseMutateFunction<
    {
      facilityId: string
      success: boolean
      message: string
      deletedCount?: number
    },
    Error,
    {
      plansIds: string | string[]
      facilityId: string
    },
    unknown
  >
  isDeleting: boolean
}

export default function PlanRow({
  plan,
  index,
  visibleColumns,
  isSelected,
  onToggleRow,
  deletePlan,
  isDeleting,
}: PlanRowProps) {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showUserAssignmentDialog, setShowUserAssignmentDialog] = useState(false)
  const [showAssignedUsersDialog, setShowAssignedUsersDialog] = useState(false)

  const handleDelete = () => {
    deletePlan(
      { plansIds: plan.id, facilityId: plan.facilityId },
      {
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error al eliminar el plan",
            description: error.message,
          })
        },
      },
    )
  }

  const renderCellContent = (column: { key: string; label: string }) => {
    if (column.key === "generateInvoice" || column.key === "freeTest" || column.key === "current") {
      return <Checkbox checked={plan[column.key] as boolean} disabled />
    }

    if (column.key === "startDate" || column.key === "endDate") {
      return new Date(plan[column.key] as unknown as string).toLocaleDateString()
    }

    if (column.key === "diaryPlans") {
      return (
        <div className="flex items-center justify-center">
          <span>{plan.diaryPlans.length}</span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="ml-2">
                <Info className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogPortal>
              <DialogContent className="sm:max-w-[80%] md:max-w-[60%] lg:max-w-[50%] xl:max-w-[40%] h-[80vh] flex flex-col rounded-md">
                <DialogHeader>
                  <DialogTitle>Actividades asociadas a {plan.name}</DialogTitle>
                </DialogHeader>
                <div className="flex-grow overflow-y-auto scrollbar-thin">
                  <DiaryPlansDialog diaryPlans={plan.diaryPlans} />
                </div>
              </DialogContent>
            </DialogPortal>
          </Dialog>
        </div>
      )
    }

    if (column.key === "assignedUsersCount") {
      return (
        <div className="flex items-center justify-center gap-2">
          <span>{plan.assignedUsersCount || 0}</span>
          {plan.assignedUsersCount && plan.assignedUsersCount > 0 ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                setShowAssignedUsersDialog(true)
              }}
              className="h-6 w-6"
            >
              <Info className="h-4 w-4" />
              <span className="sr-only">Ver usuarios asignados</span>
            </Button>
          ) : null}
        </div>
      )
    }

    return plan[column.key as keyof PlanData]?.toString() || "-"
  }

  return (
    <>
      <TableRow
        className={cn(isSelected ? "bg-primary/40 dark:bg-primary/20" : index % 2 === 0 ? "bg-card/40" : "bg-muted/20")}
      >
        <TableCell className="p-0 w-[50px] text-center">
          <Checkbox checked={isSelected} onCheckedChange={() => onToggleRow(plan.id)} />
        </TableCell>
        {columnsPlans
          .filter((col) => visibleColumns.has(col.key))
          .map((column) => (
            <TableCell key={column.key} className="border-x text-center break-words">
              {renderCellContent({ key: column.key, label: column.label })}
            </TableCell>
          ))}
        <TableCell className="text-center">
          <div className="flex flex-col items-center-center gap-2 text-xs">
            <Button asChild variant="outline" className="w-auto" onClick={(e) => e.stopPropagation()}>
              <Link href={`/planes/editar/${plan.id}`}>
                <Edit className="h-3 w-3" /> Editar
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-auto"
              onClick={(e) => {
                e.stopPropagation()
                setShowUserAssignmentDialog(true)
              }}
            >
              <Users className="h-3 w-3 mr-1" /> Asignar
            </Button>
            <DeleteConfirmationDialog
              itemName={`el plan ${plan.name}`}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          </div>
        </TableCell>
      </TableRow>
      <PlanUserAssignmentDialog
        open={showUserAssignmentDialog}
        onOpenChange={setShowUserAssignmentDialog}
        planId={plan.id}
        planName={plan.name}
        facilityId={plan.facilityId}
      />
      <PlanAssignedUsersDialog
        open={showAssignedUsersDialog}
        onOpenChange={setShowAssignedUsersDialog}
        users={plan.assignedUsers || []}
        planName={plan.name}
      />
    </>
  )
}

