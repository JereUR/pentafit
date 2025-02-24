import { useQuery } from "@tanstack/react-query"
import kyInstance from "@/lib/ky"

interface FacilityMetrics {
  activeActivities: number
  currentPlans: number
  activeDiaries: number
  teamMembers: number
  clientMembers: number
}

const fetchMetrics = async (facilityId: string): Promise<FacilityMetrics> => {
  try {
    const response = await kyInstance
      .get(`/api/metrics/${facilityId}`)
      .json<FacilityMetrics>()
    console.log("Metrics response:", response)
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

  console.log("useMetrics hook state:", {
    facilityId,
    isEnabled: Boolean(facilityId),
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    data: query.data,
  })

  return query
}
