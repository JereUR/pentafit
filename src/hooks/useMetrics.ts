import { useQuery } from "@tanstack/react-query"
import kyInstance from "@/lib/ky"

export interface FacilityMetrics {
  activeActivities: number
  currentPlans: number
  activeDiaries: number
  activeRoutines: number
  activeNutritionalPlans: number
  teamMembers: number
  clientMembers: number
}

const fetchMetrics = async (facilityId: string): Promise<FacilityMetrics> => {
  try {
    const response = await kyInstance
      .get(`/api/metrics/${facilityId}`)
      .json<FacilityMetrics>()
    return response
  } catch (error) {
    console.error("Error fetching metrics:", error)
    throw error
  }
}

export const useMetrics = (facilityId?: string) => {
  const query = useQuery({
    queryKey: ["metrics", facilityId],
    queryFn: () => fetchMetrics(facilityId as string),
    enabled: Boolean(facilityId),
    retry: false,
  })

  return query
}
