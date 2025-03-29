import { useQuery } from "@tanstack/react-query"
import type { UserClient } from "@/types/user"

async function fetchAssignedPlanUsers(planId: string): Promise<UserClient[]> {
  const response = await fetch(`/api/plans/assigned-users/${planId}`)
  if (!response.ok) {
    throw new Error("Error al obtener los usuarios asignados al plan")
  }
  return response.json()
}

export function useAssignedPlanUsers(planId: string) {
  return useQuery({
    queryKey: ["assignedPlanUsers", planId],
    queryFn: () => fetchAssignedPlanUsers(planId),
    enabled: !!planId,
  })
}
