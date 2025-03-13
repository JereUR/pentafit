import { useQuery } from "@tanstack/react-query"

import kyInstance from "@/lib/ky"
import { PAGE_SIZE } from "@/lib/prisma"
import { RoutineData } from "@/types/routine"

const fetchAllPresetRoutines = async (
  facilityId: string,
  page: number,
  pageSize: number,
  search: string,
): Promise<{ allPresetRoutines: RoutineData[] }> => {
  return kyInstance
    .get(`/api/preset-routines/${facilityId}/all`, {
      searchParams: { page, pageSize, search },
    })
    .json<{ allPresetRoutines: RoutineData[] }>()
}

export const useAllPresetRoutines = (
  facilityId?: string,
  page: number = 1,
  search: string = "",
) => {
  return useQuery({
    queryKey: ["preset-routines", facilityId, page, PAGE_SIZE, search],
    queryFn: () =>
      fetchAllPresetRoutines(facilityId as string, page, PAGE_SIZE, search),
    enabled: !!facilityId,
  })
}
