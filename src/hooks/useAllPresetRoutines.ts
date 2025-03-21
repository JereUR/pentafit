import { useQuery } from "@tanstack/react-query"

import kyInstance from "@/lib/ky"
import { RoutineData } from "@/types/routine"

const fetchAllPresetRoutines = async (
  facilityId: string,
): Promise<{ allPresetRoutines: RoutineData[] }> => {
  return kyInstance
    .get(`/api/preset-routines/${facilityId}/all`)
    .json<{ allPresetRoutines: RoutineData[] }>()
}

export const useAllPresetRoutines = (facilityId?: string) => {
  return useQuery({
    queryKey: ["preset-routines", facilityId],
    queryFn: () => fetchAllPresetRoutines(facilityId as string),
    enabled: !!facilityId,
  })
}
