"use client"

import { getCurrentDayOfWeek, DAY_DISPLAY_NAMES } from "@/lib/utils"
import { useTodayClientData } from "@/hooks/useTodayClientData"
import { Skeleton } from "../../ui/skeleton"
import { ExerciseList } from "./ExerciseList"
import EmptyState from "@/components/EmptyState"

interface TodayRoutineProps {
  facilityId: string
  primaryColor: string
}

export function TodayRoutine({ facilityId, primaryColor }: TodayRoutineProps) {
  const { routineData, isLoading, error } = useTodayClientData(facilityId)
  const today = getCurrentDayOfWeek()
  const dayName = DAY_DISPLAY_NAMES[today]
  const colorStyle = primaryColor ? { backgroundColor: `${primaryColor}20` } : {}

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" style={colorStyle} />
        <Skeleton className="h-20 w-full" style={colorStyle} />
        <Skeleton className="h-4 w-1/2" style={colorStyle} />
      </div>
    )
  }

  if (error) {
    return <div className="p-4 text-sm text-red-500">{error}</div>
  }

  if (!routineData) {
    return (
      <EmptyState
        title={`No hay rutina para ${dayName}`}
        description="No tienes ejercicios programados para hoy."
        icon="workout"
        primaryColor={primaryColor}
        href={`/${facilityId}/mi-rutina`}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div>{routineData.description && <p className="text-sm text-muted-foreground">{routineData.description}</p>}</div>

      <ExerciseList
        exercises={routineData.exercises}
        primaryColor={primaryColor}
        routineId={routineData.id}
        facilityId={facilityId}
        completedExercises={routineData.completedExercises || []}
      />
    </div>
  )
}
