import Link from "next/link"
import { Edit } from "lucide-react"
import type { UseMutateFunction } from "@tanstack/react-query"

import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { type DiaryData, columnsDiaries } from "@/types/diary"
import { cn } from "@/lib/utils"
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog"
import { useToast } from "@/hooks/use-toast"
import OfferDaysDialog from "./OfferDaysDialog"
import DaysAvailablesDialog from "./DaysAvailablesDialog"

interface DiaryRowProps {
  diary: DiaryData
  index: number
  visibleColumns: Set<keyof DiaryData>
  isSelected: boolean
  onToggleRow: (id: string) => void
  deleteDiary: UseMutateFunction<
    {
      facilityId: string
      success: boolean
      message: string
      deletedCount?: number
    },
    Error,
    {
      diaryIds: string | string[]
      facilityId: string
    },
    unknown
  >
  isDeleting: boolean
}

export default function DiaryRow({
  diary,
  index,
  visibleColumns,
  isSelected,
  onToggleRow,
  deleteDiary,
  isDeleting,
}: DiaryRowProps) {
  const { toast } = useToast()

  const handleDelete = () => {
    deleteDiary(
      { diaryIds: diary.id, facilityId: diary.facilityId },
      {
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error al eliminar la agenda",
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
        <Checkbox checked={isSelected} onCheckedChange={() => onToggleRow(diary.id)} />
      </TableCell>
      {columnsDiaries
        .filter((col) => visibleColumns.has(col.key))
        .map((column) => (
          <TableCell key={column.key} className="border-x text-center break-words">
            {column.key === "isActive" || column.key === "worksHolidays" ? (
              <Checkbox checked={diary[column.key] as boolean} disabled />
            ) : column.key === "dateFrom" || column.key === "dateUntil" ? (
              new Date(diary[column.key] as unknown as string).toLocaleDateString()
            ) : column.key === "offerDays" ? (
              <OfferDaysDialog name={diary.name} offerDays={diary.offerDays} />
            ) : column.key === "daysAvailable" ? (
              <DaysAvailablesDialog name={diary.name} daysAvailables={diary.daysAvailable} />
            ) : (
              diary[column.key]?.toString() || "-"
            )}
          </TableCell>
        ))}
      <TableCell className="text-center">
        <div className="flex flex-col items-center-center gap-2 text-xs">
          <Button asChild variant="outline" className="w-auto" onClick={(e) => e.stopPropagation()}>
            <Link href={`/agenda/editar/${diary.id}`}>
              <Edit className="h-3 w-3" /> Editar
            </Link>
          </Button>
          <DeleteConfirmationDialog itemName={`agenda ${diary.name}`} onDelete={handleDelete} isDeleting={isDeleting} />
        </div>
      </TableCell>
    </TableRow>
  )
}

