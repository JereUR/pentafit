'use client'

import { getClientPayments } from "@/app/(main)/(authenticated)/(client)/[facilityId]/mis-pagos/actions"
import { PaymentData } from "@/types/clientPayments"
import { useQuery } from "@tanstack/react-query"

export const useClientPayments = (facilityId?: string) => {
  return useQuery<{ payments: PaymentData[] }>({
    queryKey: ["payments", facilityId],
    queryFn: () => getClientPayments(facilityId as string),
    enabled: !!facilityId,
  })
}