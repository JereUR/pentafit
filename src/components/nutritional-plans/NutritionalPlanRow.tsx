"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, Info, Users } from "lucide-react"
import type { UseMutateFunction } from "@tanstack/react-query"

import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog"
import { useToast } from "@/hooks/use-toast"
import { columnsNutritionalPlans, NutritionalPlanData } from "@/types/nutritionalPlans"
import { UserAssignmentDialog } from "./userAssignmentDialog"
import { AssignedUsersDialog } from "./AssignedUsersDialog"
import { ConvertToPresetButton } from "./ConvertToPresetButton"
import { MealsDialog } from "./MealsDialog"

interface NutritionalPlanRowProps {
  nutritionalPlan: NutritionalPlanData
  index: number
  visibleColumns: Set<keyof NutritionalPlanData>
  isSelected: boolean
  onToggleRow: (id: string) => void
  deleteNutritionalPlan: UseMutateFunction<
    {
      facilityId: string
      success: boolean
      message: string
      deletedCount?: number
    },
    Error,
    {
      nutritionalPlanIds: string | string[]
      facilityId: string
    },
    unknown
  >
  isDeleting: boolean
  isPreset?: boolean
}

export default function NutritionalPlanRow({
  nutritionalPlan,
  index,
  visibleColumns,
  isSelected,
  onToggleRow,
  deleteNutritionalPlan,
  isDeleting,
  isPreset = false,
}: NutritionalPlanRowProps) {
  const { toast } = useToast()
  const [showMealsDialog, setShowMealsDialog] = useState(false)
  const [showUserAssignmentDialog, setShowUserAssignmentDialog] = useState(false)
  const [showAssignedUsersDialog, setShowAssignedUsersDialog] = useState(false)

  const handleDelete = () => {
    deleteNutritionalPlan(
      { nutritionalPlanIds: nutritionalPlan.id, facilityId: nutritionalPlan.facilityId },
      {
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error al eliminar el plan nutricional",
            description: error.message,
          })
        },
      },
    )
  }

  const renderCellContent = (column: { key: string; label: string }) => {
    if (column.key === "meals") {
      return (
        <div className="flex items-center justify-center gap-2">
          <span>{nutritionalPlan.dailyMeals.reduce((total, day) => total + day.meals.length, 0)}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              setShowMealsDialog(true)
            }}
            className="h-6 w-6"
          >
            <Info className="h-4 w-4" />
            <span className="sr-only">Ver comidas</span>
          </Button>
        </div>
      )
    }

    if (column.key === "assignedUsersCount") {
      return (
        <div className="flex items-center justify-center gap-2">
          <span>{nutritionalPlan.assignedUsersCount || 0}</span>
          {nutritionalPlan.assignedUsersCount && nutritionalPlan.assignedUsersCount > 0 ? (
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

    return nutritionalPlan[column.key as keyof NutritionalPlanData]?.toString() || "-"
  }

  return (
    <>
      <TableRow
        className={cn(isSelected ? "bg-primary/40 dark:bg-primary/20" : index % 2 === 0 ? "bg-card/40" : "bg-muted/20")}
      >
        <TableCell className="p-0 w-[50px] text-center">
          <Checkbox checked={isSelected} onCheckedChange={() => onToggleRow(nutritionalPlan.id)} />
        </TableCell>
        {columnsNutritionalPlans
          .filter((col) => {
            if (isPreset && col.key === "assignedUsersCount") {
              return false
            }
            return visibleColumns.has(col.key as keyof NutritionalPlanData)
          })
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
                    ? `/nutricion/planes-nutricionales/editar/${nutritionalPlan.id}`
                    : `/nutricion/planes-nutricionales-preestablecidos/editar/${nutritionalPlan.id}`
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
                  <Users className="h-3 w-3 mr-1" /> Asignar
                </Button>
                <ConvertToPresetButton nutritionalPlanId={nutritionalPlan.id} facilityId={nutritionalPlan.facilityId} />
              </>
            )}
            <DeleteConfirmationDialog
              itemName={`plan nutricional ${nutritionalPlan.name}`}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          </div>
        </TableCell>
      </TableRow>
      <MealsDialog
        open={showMealsDialog}
        onOpenChange={setShowMealsDialog}
        dailyMeals={nutritionalPlan.dailyMeals}
        planName={nutritionalPlan.name}
      />
      <UserAssignmentDialog
        open={showUserAssignmentDialog}
        onOpenChange={setShowUserAssignmentDialog}
        nutritionalPlanId={nutritionalPlan.id}
        nutritionalPlanName={nutritionalPlan.name}
        facilityId={nutritionalPlan.facilityId}
      />
      <AssignedUsersDialog
        open={showAssignedUsersDialog}
        onOpenChange={setShowAssignedUsersDialog}
        users={nutritionalPlan.assignedUsers || []}
        planName={nutritionalPlan.name}
      />
    </>
  )
}

