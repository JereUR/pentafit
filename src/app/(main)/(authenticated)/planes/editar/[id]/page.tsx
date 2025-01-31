import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { validateRequest } from "@/auth"
import { Button } from "@/components/ui/button"
import { getPlanById } from "../../actions"
import PlanForm from "@/components/plans/PlanForm"

export const metadata: Metadata = {
  title: "Editar plan",
  description: "Edita un plan de tu establecimiento"
}

export default async function EditPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = await validateRequest()

  if (!user) {
    redirect("/iniciar-sesion")
  }

  const { id } = await params

  const plan = await getPlanById(id)

  if (!plan) {
    redirect("/planes")
  }

  return (
    <main className="relative container py-8">
      <Button variant='ghost' className='absolute -top-2 md:top-11 left-0 md:left-2 border border-input'>
        <Link href='/planes' className='flex items-center gap-1'>
          <ChevronLeft /> Volver
        </Link>
      </Button>
      <PlanForm userId={user.id} planData={plan} />
    </main>
  )
}
