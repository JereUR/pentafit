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
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl text-muted-foreground">{formattedDate}</h1>
      </div>
      <ClientDashboard facilityId={facilityId} />
    </div>
  )
}

