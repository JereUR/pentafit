import { useQuery } from "@tanstack/react-query"

import kyInstance from "@/lib/ky"
import { UserFacilityData } from "@/types/facility"

const fetchUserFacilities = async (): Promise<UserFacilityData[]> => {
  return kyInstance.get(`/api/my-facilities`).json<UserFacilityData[]>()
}

export const useUserFacilities = (userId: string) => {
  return useQuery({
    queryKey: ["facilities", userId],
    queryFn: () => fetchUserFacilities(),
    enabled: !!userId,
  })
}
