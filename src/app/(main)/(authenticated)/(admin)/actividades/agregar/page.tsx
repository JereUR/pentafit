import { Metadata } from "next"
import { Suspense } from "react"
import { ChevronLeft, Loader2 } from 'lucide-react'
import Link from "next/link"

import { validateRequest } from "@/auth"
import ActivityForm from "@/components/activities/ActivityForm"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Agregar actividad",
  description: "Agrega una nueva actividad a tu establecimiento"
}

export default async function AddActivityPage() {
  const { user } = await validateRequest()

  if (!user) return null

  return (
    <main className="relative container py-8">
      <Button variant='ghost' className='absolute -top-2 md:top-11 left-0 md:left-2 border border-input'>
        <Link href='/actividades' className='flex items-center gap-1'>
          <ChevronLeft /> Volver
        </Link>
      </Button>
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
