import { Metadata } from "next"
import { Suspense } from "react"
import { ChevronLeft, Loader2 } from 'lucide-react'
import Link from "next/link"

import { validateRequest } from "@/auth"
import { Button } from "@/components/ui/button"
import PlanForm from "@/components/plans/PlanForm"

export const metadata: Metadata = {
  title: "Agregar plan",
  description: "Agrega un nuevo plan a tu establecimiento"
}

export default async function AddPlanPage() {
  const { user } = await validateRequest()

  if (!user) return null

  return (
    <main className="relative container py-8">
      <Button variant='ghost' className='absolute -top-2 md:top-11 left-0 md:left-2 border border-input'>
        <Link href='/planes' className='flex items-center gap-1'>
          <ChevronLeft /> Volver
        </Link>
      </Button>
      <section className="w-full mx-auto">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <PlanFormWrapper userId={user.id} />
        </Suspense>
      </section>
    </main>
  )
}

function PlanFormWrapper({ userId }: { userId: string }) {
  return (
    <PlanForm userId={userId} />
  )
}
