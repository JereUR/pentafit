import { useInfiniteQuery } from "@tanstack/react-query"
import kyInstance from "@/lib/ky"
import type { Transaction } from "@/types/transactions"

export interface TransactionsPage {
  transactions: Transaction[]
  nextCursor: string | null
}

const fetchTransactions = async ({
  facilityId,
  pageParam,
}: {
  facilityId: string
  pageParam: string | null
}) => {
  return kyInstance
    .get("/api/transactions", {
      searchParams: {
        facilityId,
        ...(pageParam ? { cursor: pageParam } : {}),
      },
    })
    .json<TransactionsPage>()
}

export const useInfiniteTransactions = (facilityId?: string) => {
  return useInfiniteQuery({
    queryKey: ["transactions", facilityId],
    queryFn: ({ pageParam }) =>
      fetchTransactions({
        facilityId: facilityId as string,
        pageParam,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: Boolean(facilityId),
  })
}
