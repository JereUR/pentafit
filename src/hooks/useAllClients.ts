import { useQuery } from "@tanstack/react-query"

import kyInstance from "@/lib/ky"
import { UserClient } from "@/types/user"

const fetchAllClients = async (facilityId: string): Promise<UserClient[]> => {
  return kyInstance
    .get(`/api/users/clients/${facilityId}/all`)
    .json<UserClient[]>()
}

export const useAllClients = (facilityId?: string) => {
  return useQuery({
    queryKey: ["clients", facilityId],
    queryFn: () => fetchAllClients(facilityId as string),
    enabled: !!facilityId,
    initialData: [],
  })
}
