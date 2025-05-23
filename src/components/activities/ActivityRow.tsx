"use client"

import Link from "next/link"
import { Edit } from "lucide-react"
import type { UseMutateFunction } from "@tanstack/react-query"

import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { type ActivityData, columnsActivities } from "@/types/activity"
import { cn } from "@/lib/utils"
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog"
import { useToast } from "@/hooks/use-toast"
import StaffMembersDialog from "./StaffMembersDialog"

interface ActivityRowProps {
  activity: ActivityData
  index: number
  visibleColumns: Set<keyof ActivityData>
  isSelected: boolean
  onToggleRow: (id: string) => void
  deleteActivity: UseMutateFunction<
    { message: string; deletedCount: number | undefined; facilityId: string },
    Error,
    { activityIds: string | string[]; facilityId: string },
    unknown
  >
  isDeleting: boolean
}

export default function ActivityRow({
  activity,
  index,
  visibleColumns,
  isSelected,
  onToggleRow,
  deleteActivity,
  isDeleting,
}: ActivityRowProps) {
  const { toast } = useToast()

  const handleDelete = () => {
    deleteActivity(
      { activityIds: activity.id, facilityId: activity.facilityId },
      {
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error al eliminar la actividad",
            description: error.message,
          })
        },
      },
    )
  }

  return (
    <TableRow
      className={cn(isSelected ? "bg-primary/40 dark:bg-primary/20" : index % 2 === 0 ? "bg-card/40" : "bg-muted/20")}
    >
      <TableCell className="p-0 w-[50px] text-center">
        <Checkbox checked={isSelected} onCheckedChange={() => onToggleRow(activity.id)} />
      </TableCell>
      {columnsActivities
        .filter((col) => visibleColumns.has(col.key))
        .map((column) => (
          <TableCell key={column.key} className="border-x text-center break-words">
            {column.key === "isPublic" || column.key === "generateInvoice" || column.key === "mpAvailable" ? (
              <Checkbox checked={activity[column.key] as boolean} disabled />
            ) : column.key === "startDate" || column.key === "endDate" ? (
              new Date(activity[column.key] as unknown as string).toLocaleDateString()
            ) : column.key === "staffMembers" ? (
              <StaffMembersDialog activityName={activity.name} staffMembers={activity.staffMembers || []} />
            ) : (
              activity[column.key]?.toString() || "-"
            )}
          </TableCell>
        ))}
      <TableCell className="text-center">
        <div className="flex flex-col items-center-center gap-2 text-xs">
          <Button asChild variant="outline" className="w-auto" onClick={(e) => e.stopPropagation()}>
            <Link href={`/actividades/editar/${activity.id}`}>
              <Edit className="h-3 w-3" /> Editar
            </Link>
          </Button>
          <DeleteConfirmationDialog
            itemName={`la actividad ${activity.name}`}
            onDelete={handleDelete}
            isDeleting={isDeleting}
            associatedItemsWarning="Esta acción también eliminará todas las agendas asociadas a esta actividad."
          />
        </div>
      </TableCell>
    </TableRow>
  )
}

