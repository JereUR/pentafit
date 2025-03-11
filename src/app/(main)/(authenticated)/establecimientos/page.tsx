import { Metadata } from "next"
import { Suspense } from "react"

import { validateRequest } from "@/auth"
import FacilitiesDashboard from "@/components/facilities/FacilitiesDashboard"
import { FacilitiesDashboardSkeleton } from "@/components/skeletons/FacilityDashboardSkeleton"

export const metadata: Metadata = {
  title: "Establecimientos",
}

export default async function FacilitiesPage() {
  const { user } = await validateRequest()

  if (!user) return null

  return (
    <main className="flex container gap-5 p-5">
      <Suspense fallback={<FacilitiesDashboardSkeleton />}>
        <FacilitiesDashboard userId={user.id} />
      </Suspense>
    </main>
  )
}
