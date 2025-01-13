"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  FacilityData,
  FacilityReduceData,
  WorkingFacility,
} from "@/types/facility"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"

export function useFacilities(userId: string) {
  const { workingFacility, setWorkingFacility } = useWorkingFacility()
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

  const setWorkingFacilityLocal = (facility: WorkingFacility) => {
    updateFacilityMutation.mutate({
      id: facility.id,
      isWorking: true,
      userId,
    } as FacilityData)
    setWorkingFacility(facility)
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
    workingFacility,
    setWorkingFacility: setWorkingFacilityLocal,
    setActiveFacility,
    setInactiveFacility,
  }
}
