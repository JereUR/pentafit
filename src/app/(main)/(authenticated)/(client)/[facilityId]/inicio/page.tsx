import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { formatDate } from "@/lib/utils"
import { Suspense } from "react"
import { ClientDashboardSkeleton } from "@/components/skeletons/ClientDashboardSkeleton"
import { ClientDashboard } from "@/components/dashboard/client/ClientDashboard"
import { validateRequest } from "@/auth"

type Props = {
  params: Promise<{ facilityId: string }>
  searchParams: Promise<{ facilityName?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const facilityName = (await searchParams).facilityName || "Establecimiento"

  return {
    title: `Inicio | ${facilityName}`,
  }
}

export default async function UserFacilityPage({ params }: Props) {
  const { user } = await validateRequest()

  if (!user) redirect("/iniciar-sesion")

  const facilityId = (await params).facilityId
  const today = new Date()
  const formattedDate = formatDate(today)

  if (!facilityId) {
    return notFound()
  }

  return (
    <main className="flex flex-col container gap-5 p-5">
      <div className="mb-6">
        <h1 className="text-2xl text-muted-foreground">{formattedDate}</h1>
      </div>
      <Suspense fallback={<ClientDashboardSkeleton />}>
        <ClientDashboard facilityId={facilityId} />
      </Suspense>
    </main>
  )
}

