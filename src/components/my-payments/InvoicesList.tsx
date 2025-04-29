"use client"

import { Skeleton } from "@/components/ui/skeleton"
import EmptyState from "@/components/EmptyState"
import { useClientInvoices } from "@/hooks/useClientInvoices"
import { InvoiceCard } from "./InvoiceCard"

interface InvoicesListProps {
  facilityId: string
  primaryColor: string
}

export function InvoicesList({ facilityId, primaryColor }: InvoicesListProps) {
  const { data, isLoading, error } = useClientInvoices(facilityId)

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton
            key={i}
            className="h-[120px] sm:h-[150px] w-full rounded-lg"
            style={{ backgroundColor: `${primaryColor}10` }}
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-3 sm:p-4 text-xs sm:text-sm text-red-500 bg-red-50 rounded-lg">
        Error al cargar tus facturas
      </div>
    )
  }

  if (!data?.invoices || data.invoices.length === 0) {
    return (
      <EmptyState
        title="No tienes facturas registradas"
        description="Aún no se han generado facturas para tus pagos en esta institución."
        icon="invoice"
        primaryColor={primaryColor}
        showRedirectButton={false}
      />
    )
  }

  return (
    <div className="space-y-4">
      {data.invoices.map((invoice) => (
        <InvoiceCard
          key={invoice.id}
          invoice={invoice}
          primaryColor={primaryColor}
        />
      ))}
    </div>
  )
}