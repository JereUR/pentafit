import { useQuery } from "@tanstack/react-query"
import { ActivityData } from "@/types/activity"
import kyInstance from "@/lib/ky"
import { PAGE_SIZE } from "@/lib/prisma"

const fetchActivities = async (
  facilityId: string,
  page: number,
  pageSize: number,
): Promise<{ activities: ActivityData[]; total: number }> => {
  return kyInstance
    .get(`/api/activities/${facilityId}`, { searchParams: { page, pageSize } })
    .json<{ activities: ActivityData[]; total: number }>()
}

export const useActivities = (facilityId?: string, page: number = 1) => {
  return useQuery({
    queryKey: ["activities", facilityId, page, PAGE_SIZE],
    queryFn: () => fetchActivities(facilityId as string, page, PAGE_SIZE),
    enabled: !!facilityId,
  })
}
