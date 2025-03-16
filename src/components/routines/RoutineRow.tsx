"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, Info, Users } from "lucide-react"
import type { UseMutateFunction } from "@tanstack/react-query"

import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { type RoutineData, columnsRoutines } from "@/types/routine"
import { cn } from "@/lib/utils"
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog"
import { useToast } from "@/hooks/use-toast"
import { ExercisesDialog } from "./ExercisesDialog"
import { UserAssignmentDialog } from "./UserAssignmentDialog"

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
  isPreset?: boolean
}

export default function RoutineRow({
  routine,
  index,
  visibleColumns,
  isSelected,
  onToggleRow,
  deleteRoutine,
  isDeleting,
  isPreset = false,
}: RoutineRowProps) {
  const { toast } = useToast()
  const [showExercisesDialog, setShowExercisesDialog] = useState(false)
  const [showUserAssignmentDialog, setShowUserAssignmentDialog] = useState(false)

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

  const renderCellContent = (column: { key: string; label: string }) => {
    if (column.key === "exercises") {
      return (
        <div className="flex items-center justify-center gap-2">
          <span>{routine.dailyExercises.reduce((total, day) => total + day.exercises.length, 0)}</span>
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

    return routine[column.key as keyof RoutineData]?.toString() || "-"
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
          .filter((col) => visibleColumns.has(col.key as keyof RoutineData))
          .map((column) => (
            <TableCell key={column.key} className="border-x text-center break-words">
              {renderCellContent(column)}
            </TableCell>
          ))}
        <TableCell className="text-center">
          <div className="flex flex-col items-center-center gap-2 text-xs">
            <Button asChild variant="outline" className="w-auto" onClick={(e) => e.stopPropagation()}>
              <Link
                href={
                  !isPreset
                    ? `/entrenamiento/rutinas/editar/${routine.id}`
                    : `/entrenamiento/rutinas-preestablecidas/editar/${routine.id}`
                }
              >
                <Edit className="h-3 w-3" /> Editar
              </Link>
            </Button>
            {!isPreset && (
              <>
                <Button
                  variant="outline"
                  className="w-auto"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowUserAssignmentDialog(true)
                  }}
                >
                  <Users className="h-3 w-3" /> Asignar
                </Button>
              </>
            )}
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
        dailyExercises={routine.dailyExercises}
        routineName={routine.name}
      />
      <UserAssignmentDialog
        open={showUserAssignmentDialog}
        onOpenChange={setShowUserAssignmentDialog}
        routineId={routine.id}
        routineName={routine.name}
        facilityId={routine.facilityId}
      />
    </>
  )
}

