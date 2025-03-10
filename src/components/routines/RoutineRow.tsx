"use client"

import Link from "next/link"
import { Edit, Info } from "lucide-react"
import type { UseMutateFunction } from "@tanstack/react-query"
import { useState } from "react"

import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { type RoutineData, columnsRoutines } from "@/types/routine"
import { cn } from "@/lib/utils"
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog"
import { useToast } from "@/hooks/use-toast"
import { ExercisesDialog } from "./ExercisesDialog"

interface RoutineRowProps {
  routine: RoutineData
  index: number
  visibleColumns: Set<keyof RoutineData>
  isSelected: boolean
  onToggleRow: (id: string) => void
  deleteRoutine: UseMutateFunction<
    {
      facilityId: string
      success: boolean
      message: string
      deletedCount?: number
    },
    Error,
    {
      routineIds: string | string[]
      facilityId: string
    },
    unknown
  >
  isDeleting: boolean
}

export default function RoutineRow({
  routine,
  index,
  visibleColumns,
  isSelected,
  onToggleRow,
  deleteRoutine,
  isDeleting,
}: RoutineRowProps) {
  const { toast } = useToast()
  const [showExercisesDialog, setShowExercisesDialog] = useState(false)

  const handleDelete = () => {
    deleteRoutine(
      { routineIds: routine.id, facilityId: routine.facilityId },
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

  const renderCellContent = (column: { key: keyof RoutineData; label: string }) => {
    if (column.key === "exercises") {
      return (
        <div className="flex items-center justify-center gap-2">
          <span>{routine.exercises.length}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              setShowExercisesDialog(true)
            }}
            className="h-6 w-6"
          >
            <Info className="h-4 w-4" />
            <span className="sr-only">Ver ejercicios</span>
          </Button>
        </div>
      )
    }

    return routine[column.key]?.toString() || "-"
  }

  return (
    <>
      <TableRow
        className={cn(isSelected ? "bg-primary/40 dark:bg-primary/20" : index % 2 === 0 ? "bg-card/40" : "bg-muted/20")}
      >
        <TableCell className="p-0 w-[50px] text-center">
          <Checkbox checked={isSelected} onCheckedChange={() => onToggleRow(routine.id)} />
        </TableCell>
        {columnsRoutines
          .filter((col) => visibleColumns.has(col.key))
          .map((column) => (
            <TableCell key={column.key} className="border-x text-center break-words">
              {renderCellContent(column)}
            </TableCell>
          ))}
        <TableCell className="text-center">
          <div className="flex flex-col items-center-center gap-2 text-xs">
            <Button asChild variant="outline" className="w-auto" onClick={(e) => e.stopPropagation()}>
              <Link href={`/entrenamiento/rutinas/editar/${routine.id}`}>
                <Edit className="h-3 w-3" /> Editar
              </Link>
            </Button>
            <DeleteConfirmationDialog
              itemName={`rutina ${routine.name}`}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          </div>
        </TableCell>
      </TableRow>
      <ExercisesDialog
        open={showExercisesDialog}
        onOpenChange={setShowExercisesDialog}
        exercises={routine.exercises}
        routineName={routine.name}
      />
    </>
  )
}

