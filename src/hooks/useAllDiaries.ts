import { useQuery } from "@tanstack/react-query"

import { AllDIaryData } from "@/types/diary"
import kyInstance from "@/lib/ky"

const fetchAllDiaries = async (
  facilityId: string,
): Promise<{ diaries: AllDIaryData[] }> => {
  return kyInstance
    .get(`/api/diaries/${facilityId}/all`)
    .json<{ diaries: AllDIaryData[] }>()
}

export const useAllDiaries = (facilityId?: string) => {
  return useQuery({
    queryKey: ["diaries", facilityId],
    queryFn: () => fetchAllDiaries(facilityId as string),
    enabled: !!facilityId,
  })
}
