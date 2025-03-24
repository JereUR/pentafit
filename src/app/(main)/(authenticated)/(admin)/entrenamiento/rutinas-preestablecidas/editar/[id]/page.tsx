import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { validateRequest } from "@/auth"
import { Button } from "@/components/ui/button"
import { getPresetRoutineById } from "../../actions"
import PresetRoutineForm from "@/components/routines/PresetRoutineForm"

export const metadata: Metadata = {
  title: "Editar rutina preestablecida",
  description: "Edita una rutina preestablecida de tu establecimiento"
}

export default async function EditRoutinePage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = await validateRequest()

  if (!user) {
    redirect("/iniciar-sesion")
  }

  const { id } = await params

  const routine = await getPresetRoutineById(id)

  if (!routine) {
    redirect("/entrenamiento/rutinas-preestablecidas")
  }

  return (
    <main className="relative container py-8">
      <Button variant='ghost' className='absolute -top-2 md:top-11 left-0 md:left-2 border border-input'>
        <Link href='/entrenamiento/rutinas-preestablecidas' className='flex items-center gap-1'>
          <ChevronLeft /> Volver
        </Link>
      </Button>
      <PresetRoutineForm userId={user.id} presetRoutineData={routine} />
    </main>
  )
}
