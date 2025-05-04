import { useQuery } from "@tanstack/react-query"

import kyInstance from "@/lib/ky"
import { PAGE_SIZE } from "@/lib/prisma"
import type { PaymentData } from "@/types/payment"

const fetchPayments = async (
  facilityId: string,
  page: number,
  pageSize: number,
  search: string,
): Promise<{ payments: PaymentData[]; total: number }> => {
  return kyInstance
    .get(`/api/payments/${facilityId}`, {
      searchParams: { page, pageSize, search },
    })
    .json<{ payments: PaymentData[]; total: number }>()
}

export const usePayments = (facilityId?: string, page: number = 1, search: string = "") => {
  return useQuery({
    queryKey: ["payments", facilityId, page, PAGE_SIZE, search],
    queryFn: () => fetchPayments(facilityId as string, page, PAGE_SIZE, search),
    enabled: !!facilityId,
  })
}