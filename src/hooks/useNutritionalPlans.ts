import { useQuery } from "@tanstack/react-query"

import kyInstance from "@/lib/ky"
import { PAGE_SIZE } from "@/lib/prisma"
import { NutritionalPlanData } from "@/types/nutritionalPlans"

const fetchNutritionalPlans = async (
  facilityId: string,
  page: number,
  pageSize: number,
  search: string,
): Promise<{ nutritionalPlans: NutritionalPlanData[]; total: number }> => {
  return kyInstance
    .get(`/api/nutritional-plans/${facilityId}`, {
      searchParams: { page, pageSize, search },
    })
    .json<{ nutritionalPlans: NutritionalPlanData[]; total: number }>()
}

export const useNutritionalPlans = (
  facilityId?: string,
  page = 1,
  search = "",
) => {
  return useQuery({
    queryKey: ["nutritionalPlans", facilityId, page, PAGE_SIZE, search],
    queryFn: () =>
      fetchNutritionalPlans(facilityId as string, page, PAGE_SIZE, search),
    enabled: !!facilityId,
    initialData: { nutritionalPlans: [], total: 0 },
  })
}
