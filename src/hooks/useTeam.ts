import { useQuery } from "@tanstack/react-query"
import { TeamData } from "@/types/team"
import kyInstance from "@/lib/ky"
import { PAGE_SIZE } from "@/lib/prisma"

const fetchTeam = async (
  facilityId: string,
  page: number,
  pageSize: number,
  search: string,
): Promise<{ members: TeamData[]; total: number }> => {
  return kyInstance
    .get(`/api/team/${facilityId}`, {
      searchParams: { page, pageSize, search },
    })
    .json<{ members: TeamData[]; total: number }>()
}

export const useTeam = (
  facilityId?: string,
  page: number = 1,
  search: string = "",
) => {
  return useQuery({
    queryKey: ["team", facilityId, page, PAGE_SIZE, search],
    queryFn: () => fetchTeam(facilityId as string, page, PAGE_SIZE, search),
    enabled: !!facilityId,
  })
}
