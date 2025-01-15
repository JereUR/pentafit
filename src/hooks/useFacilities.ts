"use client"

import {
  useQuery,
  useMutation,
  useQueryClient,
  useIsMutating,
} from "@tanstack/react-query"

import {
  FacilityData,
  FacilityReduceData,
  WorkingFacility,
} from "@/types/facility"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"

export function useFacilities(userId: string) {
  const { workingFacility, updateWorkingFacility } = useWorkingFacility()
  const queryClient = useQueryClient()

  const queryKey = ["facilities", userId]

  const facilitiesQuery = useQuery<FacilityReduceData[]>({
    queryKey,
    queryFn: () =>
      fetch(`/api/users/${userId}/facilities`).then((res) => res.json()),
  })

  const updateFacilityMutation = useMutation({
    mutationKey: ["updateFacility"],
    mutationFn: (updatedFacility: FacilityData) =>
      fetch(`/api/facility/${updatedFacility.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedFacility),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: ["workingFacility"] })
      queryClient.invalidateQueries({
        queryKey: ["facilityDetails", data.id],
      })
      if (data.isWorking) {
        updateWorkingFacility({
          id: data.id,
          name: data.name,
          logoUrl: data.logoUrl,
        })
      } else if (workingFacility && workingFacility.id === data.id) {
        updateWorkingFacility(null)
      }
    },
  })

  const setWorkingFacilityLocal = (facility: WorkingFacility) => {
    updateFacilityMutation.mutate({
      id: facility.id,
      isWorking: true,
      userId,
    } as FacilityData)
  }

  const isUpdatingFacility =
    useIsMutating({ mutationKey: ["updateFacility"] }) > 0

  return {
    facilities: facilitiesQuery.data,
    isLoading: facilitiesQuery.isLoading,
    error: facilitiesQuery.error,
    workingFacility,
    setWorkingFacility: setWorkingFacilityLocal,
    isUpdatingFacility,
  }
}

export function useFacilityDetails(facilityId: string | null) {
  const queryClient = useQueryClient()

  const fetchFacilityDetails = async (id: string) => {
    const response = await fetch(`/api/facility/${id}`)
    if (!response.ok) throw new Error("Failed to fetch facility details")
    return response.json()
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ["facilityDetails", facilityId],
    queryFn: () => fetchFacilityDetails(facilityId!),
  })

  const invalidateFacilityDetails = () => {
    if (facilityId) {
      queryClient.invalidateQueries({
        queryKey: ["facilityDetails", facilityId],
      })
    }
  }

  return { data, error, isLoading, invalidateFacilityDetails }
}
