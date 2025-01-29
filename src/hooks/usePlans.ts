import { useQuery } from "@tanstack/react-query"

import { PlanData } from "@/types/plan"
import kyInstance from "@/lib/ky"
import { PAGE_SIZE } from "@/lib/prisma"

const fetchPlans = async (
  facilityId: string,
  page: number,
  pageSize: number,
  search: string,
): Promise<{ plans: PlanData[]; total: number }> => {
  return kyInstance
    .get(`/api/plans/${facilityId}`, {
      searchParams: { page, pageSize, search },
    })
    .json<{ plans: PlanData[]; total: number }>()
}

export const usePlans = (
  facilityId?: string,
  page: number = 1,
  search: string = "",
) => {
  return useQuery({
    queryKey: ["plans", facilityId, page, PAGE_SIZE, search],
    queryFn: () => fetchPlans(facilityId as string, page, PAGE_SIZE, search),
    enabled: !!facilityId,
  })
}
