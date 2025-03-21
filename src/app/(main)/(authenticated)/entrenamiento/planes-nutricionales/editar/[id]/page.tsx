import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { validateRequest } from "@/auth"
import { Button } from "@/components/ui/button"
import { getNutritionalPlanById } from "../../actions"
import NutritionalPlanForm from "@/components/nutritional-plans/NutritionalPlanForm"

export const metadata: Metadata = {
  title: "Editar rutina",
  description: "Edita una rutina de tu establecimiento"
}

export default async function EditNutritionalPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = await validateRequest()

  if (!user) {
    redirect("/iniciar-sesion")
  }

  const { id } = await params

  const nutritionalPlan = await getNutritionalPlanById(id)

  if (!nutritionalPlan) {
    redirect("/entranamiento/planes-nutricionales")
  }

  return (
    <main className="relative container py-8">
      <Button variant='ghost' className='absolute -top-2 md:top-11 left-0 md:left-2 border border-input'>
        <Link href='/entrenamiento/planes-nutricionales' className='flex items-center gap-1'>
          <ChevronLeft /> Volver
        </Link>
      </Button>
      <NutritionalPlanForm userId={user.id} nutritionalPlanData={nutritionalPlan} />
    </main>
  )
}
