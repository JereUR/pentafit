"use client"

import { useQuery } from "@tanstack/react-query"
import { getUserProgressData } from "@/app/(main)/(authenticated)/(client)/[facilityId]/mi-progreso/actions"
import type { ProgressData } from "@/types/progress"

export function useUserProgress(facilityId: string, userId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userProgress", userId, facilityId],
    queryFn: () => getUserProgressData(userId, facilityId),
    enabled: !!facilityId && !!userId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  return {
    progressData: data as ProgressData | null,
    isLoading,
    error: error ? (error instanceof Error ? error.message : "Error al cargar los datos de progreso") : null,
  }
}
