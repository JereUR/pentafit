import ActivitiesDashboard from "@/components/activities/ActivitiesDashboard"
import { Loader2 } from "lucide-react"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Actividades",
}

export default async function ActivitiesPage() {

  return (
    <main className="flex container gap-5 p-5">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <ActivitiesDashboard />
      </Suspense>
    </main>
  )
}
