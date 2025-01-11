import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useActiveFacility } from "../contexts/ActiveFacilityContext"

interface Facility {
  id: string
  name: string
  isWorking: boolean
  // ... otros campos
}

export function useFacilities(userId: string) {
  const { activeFacilityId, setActiveFacilityId } = useActiveFacility()
  const queryClient = useQueryClient()

  const queryKey = ["facilities", userId]

  const facilitiesQuery = useQuery<Facility[]>({
    queryKey,
    queryFn: () =>
      fetch(`/api/users/${userId}/facilities`).then((res) => res.json()),
  })

  const updateFacilityMutation = useMutation({
    mutationFn: (updatedFacility: Facility) =>
      fetch(`/api/facilities/${updatedFacility.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedFacility),
      }).then((res) => res.json()),
    onSuccess: (updatedFacility) => {
      queryClient.invalidateQueries({ queryKey })
      if (updatedFacility.isWorking) {
        setActiveFacilityId(updatedFacility.id)
      }
    },
  })

  const setActiveFacility = (facilityId: string) => {
    updateFacilityMutation.mutate({
      id: facilityId,
      isWorking: true,
      // Asume que otros campos se manejan en el backend
    } as Facility)
  }

  return {
    facilities: facilitiesQuery.data,
    isLoading: facilitiesQuery.isLoading,
    error: facilitiesQuery.error,
    activeFacilityId,
    setActiveFacility,
  }
}
