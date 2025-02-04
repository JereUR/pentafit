import { useQuery } from "@tanstack/react-query"

import { ActivityData } from "@/types/activity"
import kyInstance from "@/lib/ky"

const fetchAllActivities = async (
  facilityId: string,
): Promise<{ activities: ActivityData[] }> => {
  return kyInstance
    .get(`/api/activities/${facilityId}/all`)
    .json<{ activities: ActivityData[] }>()
}

export const useAllActivities = (facilityId?: string) => {
  return useQuery({
    queryKey: ["activities", facilityId],
    queryFn: () => fetchAllActivities(facilityId as string),
    enabled: !!facilityId,
  })
}
