import { Metadata } from "next"
import { Suspense } from "react"
import { ChevronLeft, Loader2 } from 'lucide-react'
import Link from "next/link"

import { validateRequest } from "@/auth"
import { Button } from "@/components/ui/button"
import RoutineForm from "@/components/routines/RoutineForm"

export const metadata: Metadata = {
  title: "Agregar rutina",
  description: "Agrega una nueva rutina a tu establecimiento"
}

export default async function AddRoutinePage() {
  const { user } = await validateRequest()

  if (!user) return null

  return (
    <main className="relative container py-8">
      <Button variant='ghost' className='absolute -top-2 md:top-11 left-0 md:left-2 border border-input'>
        <Link href='/entrenamiento/rutinas' className='flex items-center gap-1'>
          <ChevronLeft /> Volver
        </Link>
      </Button>
      <section className="w-full mx-auto">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <RoutineFormWrapper userId={user.id} />
        </Suspense>
      </section>
    </main>
  )
}

function RoutineFormWrapper({ userId }: { userId: string }) {
  return (
    <RoutineForm userId={userId} />
  )
}
