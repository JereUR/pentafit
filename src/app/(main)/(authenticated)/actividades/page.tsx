import { validateRequest } from "@/auth"
import ActivitiesDashboard from "@/components/activities/ActivitiesDashboard"
import WorkingFacility from "@/components/WorkingFacility"
import { Loader2 } from 'lucide-react'
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Actividades",
}

export default async function ActivitiesPage() {
  const { user } = await validateRequest()

  if (!user) return null

  return (
    <main className="flex container gap-5 md:p-5">
      <div className="flex flex-col gap-5">
        <section className="w-full flex justify-center md:justify-start">
          <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
            <WorkingFacility userId={user.id} />
          </Suspense>
        </section>
        <section className="flex-1">
          <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
            <ActivitiesDashboard userId={user.id}/>
          </Suspense>
        </section>
      </div>
    </main>
  )
}