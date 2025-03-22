import { useQuery } from "@tanstack/react-query"

import kyInstance from "@/lib/ky"
import { NutritionalPlanData } from "@/types/nutritionalPlans"

const fetchAllPresetNutritionalPlans = async (
  facilityId: string,
): Promise<NutritionalPlanData[]> => {
  return kyInstance
    .get(`/api/preset-nutritional-plans/${facilityId}/all`)
    .json<NutritionalPlanData[]>()
}

export const useAllPresetNutritionalPlans = (facilityId?: string) => {
  return useQuery({
    queryKey: ["presetNutritionalPlans", facilityId],
    queryFn: () => fetchAllPresetNutritionalPlans(facilityId as string),
    enabled: !!facilityId,
    initialData: [],
  })
}
