import { Metadata } from "next"
import { Suspense } from "react"

import { validateRequest } from "@/auth"
import ActivitiesDashboard from "@/components/activities/ActivitiesDashboard"
import { TableSkeleton } from "@/components/skeletons/TableSkeleton"
import { WorkingFacilitySkeleton } from "@/components/skeletons/WorkingFacilitySkeleton"
import WorkingFacility from "@/components/WorkingFacility"

export const metadata: Metadata = {
  title: "Actividades",
}

export default async function ActivitiesPage() {
  const { user } = await validateRequest()

  if (!user) return null

  return (
    <main className="w-full max-w-full overflow-x-hidden">
      <div className="flex flex-col gap-5 md:p-5">
        <section className="w-full flex justify-center md:justify-start">
          <Suspense fallback={<WorkingFacilitySkeleton />}>
            <WorkingFacility userId={user.id} />
          </Suspense>
        </section>
        <section className="flex-1">
          <Suspense fallback={<TableSkeleton />}>
            <ActivitiesDashboard userId={user.id} />
          </Suspense>
        </section>
      </div>
    </main>
  )
}