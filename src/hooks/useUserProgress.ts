"use client"

import { useQuery } from "@tanstack/react-query"

import { getUserProgress } from "@/app/(main)/(authenticated)/(client)/[facilityId]/mi-progreso/actions"
import { ProgressData } from "@/types/progress"

export function useUserProgress(facilityId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userProgress", facilityId],
    queryFn: () => getUserProgress(facilityId),
    enabled: !!facilityId,
    staleTime: 5 * 60 * 1000,
  })

  return {
    progressData: data as ProgressData | null,
    isLoading,
    error: error ? "Error al cargar los datos de progreso" : null,
  }
}
