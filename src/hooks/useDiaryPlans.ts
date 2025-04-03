import { useQuery } from "@tanstack/react-query"

import kyInstance from "@/lib/ky"
import { DiaryPlanData } from "@/types/user"

const fetchDiaryPlans = async (
  facilityId: string,
): Promise<{ diaryPlans: DiaryPlanData[] }> => {
  const response = await kyInstance
    .get(`/api/diary-plans/${facilityId}/available`)
    .json<{ diaryPlans: DiaryPlanData[] }>()

  return {
    diaryPlans: response.diaryPlans.filter((plan) => plan.vacancies > 0),
  }
}

export const useDiaryPlans = (facilityId?: string) => {
  return useQuery({
    queryKey: ["diaryPlans", facilityId],
    queryFn: () => fetchDiaryPlans(facilityId as string),
    enabled: !!facilityId,
  })
}
