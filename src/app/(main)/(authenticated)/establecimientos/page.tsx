import { Loader2 } from "lucide-react"
import { Metadata } from "next"
import { Suspense } from "react"

import { validateRequest } from "@/auth"
import FacilitiesDashboard from "@/components/facilities/FacilitiesDashboard"

export const metadata: Metadata = {
  title: "Establecimientos",
}

export default async function FacilitiesPage() {
  const { user } = await validateRequest()

  if (!user) return null

  return (
    <main className="flex container gap-5 p-5">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <FacilitiesDashboard userId={user.id} />
      </Suspense>
    </main>
  )
}
