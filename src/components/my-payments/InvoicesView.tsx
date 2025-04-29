"use client"

import { Suspense } from "react"

import { ClientDashboardSkeleton } from "@/components/skeletons/ClientDashboardSkeleton"
import { InvoicesList } from "./InvoicesList"

interface InvoicesViewProps {
  facilityId: string
  primaryColor: string
}

export default function InvoicesView({ facilityId, primaryColor }: InvoicesViewProps) {
  return (
    <div className="space-y-4">
      <Suspense fallback={<ClientDashboardSkeleton type="invoice" />}>
        <InvoicesList facilityId={facilityId} primaryColor={primaryColor} />
      </Suspense>
    </div>
  )
}