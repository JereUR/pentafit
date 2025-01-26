import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { validateRequest } from "@/auth"
import { Button } from "@/components/ui/button"
import { getMemberById } from "../../actions"
import MemberForm from "@/components/team/MemberForm"

export const metadata: Metadata = {
  title: "Editar actividad",
  description: "Edita una actividad de tu establecimiento"
}

export default async function EditTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = await validateRequest()

  if (!user) {
    redirect("/iniciar-sesion")
  }

  const { id } = await params

  const member = await getMemberById(id)

  if (!member) {
    redirect("/equipo")
  }

  return (
    <main className="relative container py-8">
      <Button variant='ghost' className='absolute -top-2 md:top-11 left-0 md:left-2 border border-input'>
        <Link href='/equipo' className='flex items-center gap-1'>
          <ChevronLeft /> Volver
        </Link>
      </Button>
      <MemberForm userId={user.id} memberData={member} />
    </main>
  )
}
