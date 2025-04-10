"use client"

import { useQuery } from "@tanstack/react-query"

import { DAY_DISPLAY_NAMES } from "@/lib/utils"
import type { RoutineData } from "@/types/routine"
import type { DayOfWeek } from "@prisma/client"

async function fetchRoutineData(
  facilityId: string,
): Promise<RoutineData | null> {
  const response = await fetch(`/api/user/routine/${facilityId}`)
  const result = await response.json()
  return result.data || null
}

export function useUserRoutine(facilityId: string) {
  const routineQuery = useQuery({
    queryKey: ["userRoutine", facilityId],
    queryFn: () => fetchRoutineData(facilityId),
    enabled: !!facilityId,
  })

  return {
    isLoading: routineQuery.isLoading,
    data: routineQuery.data,
    error: routineQuery.error
      ? "Error al cargar la rutina. Por favor, intenta de nuevo."
      : null,
    dayNames: DAY_DISPLAY_NAMES as Record<DayOfWeek, string>,
  }
}
