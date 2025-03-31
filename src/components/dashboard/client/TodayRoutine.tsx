'use client'

import { getCurrentDayOfWeek, DAY_DISPLAY_NAMES } from "@/lib/utils"
import { useTodayClientData } from "@/hooks/useTodayClientData"
import { Skeleton } from "../../ui/skeleton"
import { EmptyState } from "./EmptyState"
import { ExerciseList } from "./ExerciseList"

interface TodayRoutineProps {
  facilityId: string
  primaryColor: string
  secondaryColor: string
}

export function TodayRoutine({ facilityId, primaryColor, secondaryColor }: TodayRoutineProps) {
  const { routineData, isLoading, error } = useTodayClientData(facilityId)
  const today = getCurrentDayOfWeek()
  const dayName = DAY_DISPLAY_NAMES[today]

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-4 w-1/2" />
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
        secondaryColor={secondaryColor}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">{routineData.name}</h3>
          <span className="text-sm font-medium text-muted-foreground">{dayName}</span>
        </div>
        {routineData.description && <p className="text-sm text-muted-foreground">{routineData.description}</p>}
      </div>

      <ExerciseList exercises={routineData.exercises} primaryColor={primaryColor} secondaryColor={secondaryColor} />
    </div>
  )
}

