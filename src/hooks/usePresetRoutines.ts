import { useQuery } from "@tanstack/react-query"

import kyInstance from "@/lib/ky"
import { PAGE_SIZE } from "@/lib/prisma"
import { RoutineData } from "@/types/routine"

const fetchPresetRoutines = async (
  facilityId: string,
  page: number,
  pageSize: number,
  search: string,
): Promise<{ presetRoutines: RoutineData[]; total: number }> => {
  return kyInstance
    .get(`/api/preset-routines/${facilityId}`, {
      searchParams: { page, pageSize, search },
    })
    .json<{ presetRoutines: RoutineData[]; total: number }>()
}

export const usePresetRoutines = (
  facilityId?: string,
  page: number = 1,
  search: string = "",
) => {
  return useQuery({
    queryKey: ["preset-routines", facilityId, page, PAGE_SIZE, search],
    queryFn: () =>
      fetchPresetRoutines(facilityId as string, page, PAGE_SIZE, search),
    enabled: !!facilityId,
  })
}
