import { useQuery } from "@tanstack/react-query"
import kyInstance from "@/lib/ky"
import { Transaction } from "@/types/transactions"

const fetchLatestTransactions = async (
  facilityId: string,
): Promise<Transaction[]> => {
  return kyInstance
    .get(`/api/transactions/latest`, {
      searchParams: { facilityId },
    })
    .json<Transaction[]>()
}

export const useLatestTransactions = (facilityId?: string) => {
  return useQuery({
    queryKey: ["latestTransactions", facilityId],
    queryFn: () => fetchLatestTransactions(facilityId as string),
    enabled: Boolean(facilityId),
  })
}
