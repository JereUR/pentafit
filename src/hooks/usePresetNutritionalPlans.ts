import { useQuery } from "@tanstack/react-query"

import kyInstance from "@/lib/ky"
import { PAGE_SIZE } from "@/lib/prisma"
import { NutritionalPlanData } from "@/types/nutritionalPlans"

const fetchPresetNutritionalPlans = async (
  facilityId: string,
  page: number,
  pageSize: number,
  search: string,
): Promise<{
  presetNutritionalPlans: NutritionalPlanData[]
  total: number
}> => {
  return kyInstance
    .get(`/api/preset-nutritional-plans/${facilityId}`, {
      searchParams: { page, pageSize, search },
    })
    .json<{ presetNutritionalPlans: NutritionalPlanData[]; total: number }>()
}

export const usePresetNutritionalPlans = (
  facilityId?: string,
  page = 1,
  search = "",
) => {
  return useQuery({
    queryKey: ["presetNutritionalPlans", facilityId, page, PAGE_SIZE, search],
    queryFn: () =>
      fetchPresetNutritionalPlans(
        facilityId as string,
        page,
        PAGE_SIZE,
        search,
      ),
    enabled: !!facilityId,
    initialData: { presetNutritionalPlans: [], total: 0 },
  })
}
