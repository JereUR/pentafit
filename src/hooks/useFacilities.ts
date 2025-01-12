import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { FacilityData, FacilityReduceData } from "@/types/facility"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"

export function useFacilities(userId: string) {
  const { workingFacilityId } = useWorkingFacility()
  const queryClient = useQueryClient()

  const queryKey = ["facilities", userId]

  const facilitiesQuery = useQuery<FacilityReduceData[]>({
    queryKey,
    queryFn: () =>
      fetch(`/api/users/${userId}/facilities`).then((res) => res.json()),
  })

  const updateFacilityMutation = useMutation({
    mutationFn: (updatedFacility: FacilityData) =>
      fetch(`/api/facilities/${updatedFacility.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedFacility),
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const setWorkingFacility = (facilityId: string) => {
    updateFacilityMutation.mutate({
      id: facilityId,
      isWorking: true,
      userId,
    } as FacilityData)
  }

  const setActiveFacility = (facilityId: string) => {
    updateFacilityMutation.mutate({
      id: facilityId,
      isActive: true,
    } as FacilityData)
  }

  const setInactiveFacility = (facilityId: string) => {
    updateFacilityMutation.mutate({
      id: facilityId,
      isActive: false,
    } as FacilityData)
  }

  return {
    facilities: facilitiesQuery.data,
    isLoading: facilitiesQuery.isLoading,
    error: facilitiesQuery.error,
    workingFacilityId,
    setWorkingFacility,
    setActiveFacility,
    setInactiveFacility,
  }
}
