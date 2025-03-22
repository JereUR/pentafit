import { Metadata } from "next"
import { Suspense } from "react"
import { ChevronLeft, Loader2 } from 'lucide-react'
import Link from "next/link"

import { validateRequest } from "@/auth"
import { Button } from "@/components/ui/button"
import PresetNutritionalPlanForm from "@/components/nutritional-plans/PresetNutritionalPlanForm"

export const metadata: Metadata = {
  title: "Agregar plan nutricional preestablecido",
  description: "Agrega un nuevo plan nutricional preestablecido a tu establecimiento"
}

export default async function AddNutritionalPlanPage() {
  const { user } = await validateRequest()

  if (!user) return null

  return (
    <main className="relative container py-8">
      <Button variant='ghost' className='absolute -top-2 md:top-11 left-0 md:left-2 border border-input'>
        <Link href='/entrenamiento/planes-nutricionales-preestablecidos' className='flex items-center gap-1'>
          <ChevronLeft /> Volver
        </Link>
      </Button>
      <section className="w-full mx-auto">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <PresetNutritionalPlanFormWrapper userId={user.id} />
        </Suspense>
      </section>
    </main>
  )
}

function PresetNutritionalPlanFormWrapper({ userId }: { userId: string }) {
  return (
    <PresetNutritionalPlanForm userId={userId} />
  )
}
