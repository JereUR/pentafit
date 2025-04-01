"use client"

import { useQuery } from "@tanstack/react-query"
import { getCurrentDayOfWeek, DAY_DISPLAY_NAMES } from "@/lib/utils"
import type { TodayRoutineData } from "@/types/routine"
import type { TodayNutritionalPlanData } from "@/types/nutritionalPlans"

async function fetchRoutineData(
  facilityId: string,
): Promise<TodayRoutineData | null> {
  const response = await fetch(`/api/user/today-routine/${facilityId}`)
  const result = await response.json()
  return result.data || null
}

async function fetchNutritionData(
  facilityId: string,
): Promise<TodayNutritionalPlanData | null> {
  const response = await fetch(`/api/user/today-nutrition/${facilityId}`)
  const result = await response.json()
  return result.data || null
}

export function useTodayClientData(facilityId: string) {
  const today = getCurrentDayOfWeek()
  const dayName = DAY_DISPLAY_NAMES[today]

  const routineQuery = useQuery({
    queryKey: ["todayRoutine", facilityId],
    queryFn: () => fetchRoutineData(facilityId),
    enabled: !!facilityId,
  })

  const nutritionQuery = useQuery({
    queryKey: ["todayNutrition", facilityId],
    queryFn: () => fetchNutritionData(facilityId),
    enabled: !!facilityId,
  })

  const isLoading = routineQuery.isLoading || nutritionQuery.isLoading
  const error = routineQuery.error || nutritionQuery.error
  const errorMessage = error
    ? "Error al cargar los datos. Por favor, intenta de nuevo."
    : null

  return {
    isLoading,
    routineData: routineQuery.data,
    nutritionData: nutritionQuery.data,
    error: errorMessage,
    today,
    dayName,
  }
}
