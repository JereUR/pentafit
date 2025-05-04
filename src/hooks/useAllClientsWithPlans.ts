import { useQuery } from "@tanstack/react-query"

import kyInstance from "@/lib/ky"
import type { UserClientWithPlan } from "@/types/user"

const fetchAllClientsWithPlans = async (facilityId: string): Promise<UserClientWithPlan[]> => {
  return kyInstance.get(`/api/users/clients/${facilityId}/with-plans`).json<UserClientWithPlan[]>()
}

export const useAllClientsWithPlans = (facilityId?: string) => {
  return useQuery({
    queryKey: ["clientsWithPlans", facilityId],
    queryFn: () => fetchAllClientsWithPlans(facilityId as string),
    enabled: !!facilityId,
    initialData: [],
  })
}