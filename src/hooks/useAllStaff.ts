import { useQuery } from "@tanstack/react-query"

import kyInstance from "@/lib/ky"
import { StaffMember } from "@/types/activity"

const fetchAllStaff = async (facilityId: string): Promise<StaffMember[]> => {
  return kyInstance
    .get(`/api/users/staff/${facilityId}/all`)
    .json<StaffMember[]>()
}

export const useAllStaff = (facilityId?: string) => {
  return useQuery({
    queryKey: ["staff", facilityId],
    queryFn: () => fetchAllStaff(facilityId as string),
    enabled: !!facilityId,
    initialData: [],
  })
}
