import kyInstance from "@/lib/ky"
import { UserClient } from "@/types/user"
import { useQuery } from "@tanstack/react-query"

async function fetchAssignedUsers(routineId: string) {
  return kyInstance
    .get(`/api/routines/assigned-users/${routineId}`)
    .json<UserClient[]>()
}

export function useAssignedUsers(routineId: string) {
  return useQuery({
    queryKey: ["assignedUsers", routineId],
    queryFn: () => fetchAssignedUsers(routineId),
    enabled: !!routineId,
  })
}
