"use client"

import { useQuery } from "@tanstack/react-query"

import { DAY_DISPLAY_NAMES } from "@/lib/utils"
import type { NutritionalPlanData } from "@/types/nutritionalPlans"
import type { DayOfWeek } from "@prisma/client"

async function fetchNutritionalPlanData(
  facilityId: string,
): Promise<NutritionalPlanData | null> {
  const response = await fetch(`/api/user/nutritional-plan/${facilityId}`)
  const result = await response.json()
  return result.data || null
}

export function useUserNutritionalPlan(facilityId: string) {
  const nutritionalPlanQuery = useQuery({
    queryKey: ["userNutritionalPlan", facilityId],
    queryFn: () => fetchNutritionalPlanData(facilityId),
    enabled: !!facilityId,
  })

  return {
    isLoading: nutritionalPlanQuery.isLoading,
    data: nutritionalPlanQuery.data,
    error: nutritionalPlanQuery.error
      ? "Error al cargar el plan nutricional. Por favor, intenta de nuevo."
      : null,
    dayNames: DAY_DISPLAY_NAMES as Record<DayOfWeek, string>,
  }
}
