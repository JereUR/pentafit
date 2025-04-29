'use client'

import { getClientInvoices } from "@/app/(main)/(authenticated)/(client)/[facilityId]/mis-pagos/actions"
import { InvoiceData } from "@/types/clientPayments"
import { useQuery } from "@tanstack/react-query"

export const useClientInvoices = (facilityId?: string) => {
  return useQuery<{ invoices: InvoiceData[] }>({
    queryKey: ["invoices", facilityId],
    queryFn: () => getClientInvoices(facilityId as string),
    enabled: !!facilityId,
  })
}