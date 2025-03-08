import { useQuery } from "@tanstack/react-query"

import kyInstance from "@/lib/ky"
import { PAGE_SIZE } from "@/lib/prisma"
import { RoutineData } from "@/types/routine"

const fetchRoutines = async (
  facilityId: string,
  page: number,
  pageSize: number,
  search: string,
): Promise<{ routines: RoutineData[]; total: number }> => {
  return kyInstance
    .get(`/api/routines/${facilityId}`, {
      searchParams: { page, pageSize, search },
    })
    .json<{ routines: RoutineData[]; total: number }>()
}

export const useRoutines = (
  facilityId?: string,
  page: number = 1,
  search: string = "",
) => {
  return useQuery({
    queryKey: ["routines", facilityId, page, PAGE_SIZE, search],
    queryFn: () => fetchRoutines(facilityId as string, page, PAGE_SIZE, search),
    enabled: !!facilityId,
  })
}
