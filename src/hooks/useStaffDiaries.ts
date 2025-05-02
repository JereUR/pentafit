import { useQuery } from "@tanstack/react-query"

import kyInstance from "@/lib/ky"
import { StaffDiaryData } from "@/types/diary"

const fetchStaffDiaries = async (facilityId: string): Promise<{ diaries: StaffDiaryData[] }> => {
  return await kyInstance.get(`/api/staff-diaries/${facilityId}`).json()
}

export const useStaffDiaries = (facilityId?: string) => {
  return useQuery({
    queryKey: ["staffDiaries", facilityId],
    queryFn: ()=>fetchStaffDiaries(facilityId as string),
    enabled: !!facilityId,
  })
}