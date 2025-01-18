import { Metadata } from "next"
import { Suspense } from "react"
import { Loader2 } from 'lucide-react'

import { validateRequest } from "@/auth"
import ActivityForm from "@/components/activities/ActivityForm"

export const metadata: Metadata = {
  title: "Agregar actividad",
  description: "Agrega una nueva actividad a tu establecimiento"
}

export default async function AddActivityPage() {
  const { user } = await validateRequest()

  if (!user) return null

  return (
    <main className="flex container gap-5 p-5">
      <section className="w-full mx-auto">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <ActivityFormWrapper userId={user.id} />
        </Suspense>
      </section>
    </main>
  )
}

function ActivityFormWrapper({ userId }: { userId: string }) {
  return (
    <ActivityForm userId={userId} />
  )
}
