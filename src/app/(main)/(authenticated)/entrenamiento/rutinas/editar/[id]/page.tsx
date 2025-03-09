import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { validateRequest } from "@/auth"
import { Button } from "@/components/ui/button"
import { getRoutineById } from "../../actions"
import RoutineForm from "@/components/routines/RoutineForm"

export const metadata: Metadata = {
  title: "Editar agendar",
  description: "Edita una agenda de tu establecimiento"
}

export default async function EditRoutinePage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = await validateRequest()

  if (!user) {
    redirect("/iniciar-sesion")
  }

  const { id } = await params

  const routine = await getRoutineById(id)

  if (!routine) {
    redirect("/agenda")
  }

  return (
    <main className="relative container py-8">
      <Button variant='ghost' className='absolute -top-2 md:top-11 left-0 md:left-2 border border-input'>
        <Link href='/entrenamiento/rutinas' className='flex items-center gap-1'>
          <ChevronLeft /> Volver
        </Link>
      </Button>
      <RoutineForm userId={user.id} routineData={routine} />
    </main>
  )
}
