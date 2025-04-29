"use client"

import { Suspense } from "react"

import { ClientDashboardSkeleton } from "@/components/skeletons/ClientDashboardSkeleton"
import { PaymentsList } from "./PaymentsList"

interface PaymentsViewProps {
  facilityId: string
  primaryColor: string
}

export default function PaymentsView({ facilityId, primaryColor }: PaymentsViewProps) {
  return (
    <div className="space-y-4">
      <Suspense fallback={<ClientDashboardSkeleton type="payment" />}>
        <PaymentsList facilityId={facilityId} primaryColor={primaryColor} />
      </Suspense>
    </div>
  )
}