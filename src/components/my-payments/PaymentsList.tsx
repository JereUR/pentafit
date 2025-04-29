"use client"

import { Skeleton } from "@/components/ui/skeleton"
import EmptyState from "@/components/EmptyState"
import { useClientPayments } from "@/hooks/useClientPayments"
import { PaymentCard } from "./PaymentCard"

interface PaymentsListProps {
  facilityId: string
  primaryColor: string
}

export function PaymentsList({ facilityId, primaryColor }: PaymentsListProps) {
  const { data, isLoading, error } = useClientPayments(facilityId)

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
        Error al cargar tus pagos
      </div>
    )
  }

  if (!data?.payments || data.payments.length === 0) {
    return (
      <EmptyState
        title="No tienes pagos registrados"
        description="Aún no has realizado ningún pago en esta institución."
        icon="payment"
        primaryColor={primaryColor}
        showRedirectButton={false}
      />
    )
  }

  return (
    <div className="space-y-4">
      {data.payments.map((payment) => (
        <PaymentCard
          key={payment.id}
          payment={payment}
          primaryColor={primaryColor}
        />
      ))}
    </div>
  )
}