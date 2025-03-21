import kyInstance from "@/lib/ky"
import type { UserClient } from "@/types/user"
import { useQuery } from "@tanstack/react-query"

async function fetchAssignedUsers(nutritionalPlanId: string) {
  return kyInstance
    .get(`/api/nutritional-plans/assigned-users/${nutritionalPlanId}`)
    .json<UserClient[]>()
}

export function useAssignedNutritionalPlanUsers(nutritionalPlanId: string) {
  return useQuery({
    queryKey: ["assignedNutritionalPlanUsers", nutritionalPlanId],
    queryFn: () => fetchAssignedUsers(nutritionalPlanId),
    enabled: !!nutritionalPlanId,
  })
}
