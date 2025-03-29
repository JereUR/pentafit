import kyInstance from "@/lib/ky"
import { UserClient } from "@/types/user"
import { useQuery } from "@tanstack/react-query"

async function fetchAssignedRoutineUsers(routineId: string) {
  return kyInstance
    .get(`/api/routines/assigned-users/${routineId}`)
    .json<UserClient[]>()
}

export function useAssignedRoutineUsers(routineId: string) {
  return useQuery({
    queryKey: ["assignedRoutineUsers", routineId],
    queryFn: () => fetchAssignedRoutineUsers(routineId),
    enabled: !!routineId,
  })
}
