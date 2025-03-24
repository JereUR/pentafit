import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { validateRequest } from "@/auth"
import { Button } from "@/components/ui/button"
import { getPresetNutritionalPlanById } from "../../actions"
import PresetNutritionalPlanForm from "@/components/nutritional-plans/PresetNutritionalPlanForm"

export const metadata: Metadata = {
  title: "Editar plan nutricional preestablecido",
  description: "Edita un plan nutricional preestablecido de tu establecimiento"
}

export default async function EditPresetNutritionalPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = await validateRequest()

  if (!user) {
    redirect("/iniciar-sesion")
  }

  const { id } = await params

  const presetNutritionalPlan = await getPresetNutritionalPlanById(id)

  if (!presetNutritionalPlan) {
    redirect("/entranamiento/planes-nutricionales-preestablecidos")
  }

  return (
    <main className="relative container py-8">
      <Button variant='ghost' className='absolute -top-2 md:top-11 left-0 md:left-2 border border-input'>
        <Link href='/entrenamiento/planes-nutricionales-preestablecidos' className='flex items-center gap-1'>
          <ChevronLeft /> Volver
        </Link>
      </Button>
      <PresetNutritionalPlanForm userId={user.id} presetNutritionalPlanData={presetNutritionalPlan} />
    </main>
  )
}
