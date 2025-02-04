import { useQuery } from "@tanstack/react-query"

import { DiaryData } from "@/types/diary"
import kyInstance from "@/lib/ky"
import { PAGE_SIZE } from "@/lib/prisma"

const fetchDiaries = async (
  facilityId: string,
  page: number,
  pageSize: number,
  search: string,
): Promise<{ diaries: DiaryData[]; total: number }> => {
  return kyInstance
    .get(`/api/diaries/${facilityId}`, {
      searchParams: { page, pageSize, search },
    })
    .json<{ diaries: DiaryData[]; total: number }>()
}

export const useDiaries = (
  facilityId?: string,
  page: number = 1,
  search: string = "",
) => {
  return useQuery({
    queryKey: ["diaries", facilityId, page, PAGE_SIZE, search],
    queryFn: () => fetchDiaries(facilityId as string, page, PAGE_SIZE, search),
    enabled: !!facilityId,
  })
}
