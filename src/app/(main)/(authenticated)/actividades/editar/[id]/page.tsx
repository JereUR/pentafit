import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { validateRequest } from "@/auth"
import { Button } from "@/components/ui/button"
import { getActivityById } from "../../actions"
import ActivityForm from "@/components/activities/ActivityForm"

export const metadata: Metadata = {
  title: "Editar actividad",
  description: "Edita una actividad de tu establecimiento"
}

export default async function EditActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = await validateRequest()

  if (!user) {
    redirect("/login")
  }

  const { id } = await params

  const activity = await getActivityById(id)

  if (!activity) {
    redirect("/actividades")
  }

  return (
    <main className="md:relative container py-8">
      <Button variant='ghost' className='absolute top-11 left-2 border border-input'>
        <Link href='/actividades' className='flex items-center gap-1'>
          <ChevronLeft /> Volver
        </Link>
      </Button>
      <ActivityForm userId={user.id} activityData={activity} />
    </main>
  )
}
