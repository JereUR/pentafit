import { useQuery } from "@tanstack/react-query"
import type { UserDiaryData } from "@/types/user"
import { getUserDiaries } from "@/app/(main)/(authenticated)/(client)/[facilityId]/mi-agenda/actions"

export const useUserDiaries = (facilityId?: string) => {
  return useQuery<{ userDiaries: UserDiaryData[] }>({
    queryKey: ["userDiaries", facilityId],
    queryFn: () => getUserDiaries(facilityId as string),
    enabled: !!facilityId,
  })
}
