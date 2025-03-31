import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { formatDate } from "@/lib/utils"
import ClientDashboard from "@/components/dashboard/client/ClientDashboard"

type Props = {
  params: Promise<{ facilityId: string }>
  searchParams: Promise<{ facilityName?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const facilityName = (await searchParams).facilityName || "Establecimiento"

  return {
    title: `${facilityName} | Mi Establecimiento`,
  }
}

export default async function UserFacilityPage({ params }: Props) {
  const facilityId = (await params).facilityId
  const today = new Date()
  const formattedDate = formatDate(today)

  if (!facilityId) {
    return notFound()
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <p className="text-muted-foreground">{formattedDate}</p>
      </div>
      <ClientDashboard facilityId={facilityId} />
    </div>
  )
}

