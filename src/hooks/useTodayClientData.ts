"use client"

import { useEffect, useState } from "react"
import { getCurrentDayOfWeek, DAY_DISPLAY_NAMES } from "@/lib/utils"
import type { TodayRoutineData } from "@/types/routine"
import type { TodayNutritionalPlanData } from "@/types/nutritionalPlans"

export function useTodayClientData(facilityId: string) {
  const [isLoading, setIsLoading] = useState(true)
  const [routineData, setRoutineData] = useState<TodayRoutineData | null>(null)
  const [nutritionData, setNutritionData] =
    useState<TodayNutritionalPlanData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const today = getCurrentDayOfWeek()
  const dayName = DAY_DISPLAY_NAMES[today]

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)

        const routineResponse = await fetch(
          `/api/user/today-routine/${facilityId}`,
        )
        const routineResult = await routineResponse.json()

        const nutritionResponse = await fetch(
          `/api/user/today-nutrition/${facilityId}`,
        )
        const nutritionResult = await nutritionResponse.json()

        setRoutineData(routineResult.data || null)
        setNutritionData(nutritionResult.data || null)
        setError(null)
      } catch (err) {
        console.error("Error fetching today data:", err)
        setError("Error al cargar los datos. Por favor, intenta de nuevo.")
      } finally {
        setIsLoading(false)
      }
    }

    if (facilityId) {
      fetchData()
    }
  }, [facilityId])

  return {
    isLoading,
    routineData,
    nutritionData,
    error,
    today,
    dayName,
  }
}
