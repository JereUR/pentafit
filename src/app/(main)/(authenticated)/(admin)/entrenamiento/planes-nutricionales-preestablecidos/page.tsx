import { Metadata } from "next"
import { Suspense } from "react"

import { validateRequest } from "@/auth"
import WorkingFacility from "@/components/WorkingFacility"
import { WorkingFacilitySkeleton } from "@/components/skeletons/WorkingFacilitySkeleton"
import { TableSkeleton } from "@/components/skeletons/TableSkeleton"
import PresetNutritionalPlansDashboard from "@/components/nutritional-plans/PresetNutritionalPlansDashboard"

export const metadata: Metadata = {
  title: "Planes nutricionales preestablecidos",
}

export default async function PresetNutritionalPlansPage() {
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
            <PresetNutritionalPlansDashboard userId={user.id} />
          </Suspense>
        </section>
      </div>
    </main>
  )
}
