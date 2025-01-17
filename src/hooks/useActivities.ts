import { useQuery } from "@tanstack/react-query"
import { ActivityData } from "@/types/activity"
import kyInstance from "@/lib/ky"

const fetchActivities = async (facilityId: string): Promise<ActivityData[]> => {
  return kyInstance.get(`/api/activities/${facilityId}`).json<ActivityData[]>()
}

export const useActivities = (facilityId?: string) => {
  return useQuery({
    queryKey: ["activities", facilityId],
    queryFn: () => fetchActivities(facilityId as string),
    enabled: !!facilityId,
    initialData: [],
  })
}
