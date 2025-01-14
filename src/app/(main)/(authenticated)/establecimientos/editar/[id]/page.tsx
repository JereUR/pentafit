import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { validateRequest } from "@/auth"
import FacilityForm from "@/components/facilities/FacilityForm"
import { getFacilityById } from "@/lib/facilities"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Editar establecimiento",
}

export default async function EditFacilityPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = await validateRequest()

  if (!user) {
    redirect("/login")
  }

  const { id } = await params

  const facility = await getFacilityById(id)

  if (!facility) {
    redirect("/establecimientos")
  }

  return (
    <main className="md:relative container py-8">
      <Button variant='ghost' className='mb-2 md:mb-0 md:absolute md:top-0 md:left-0 border border-input'>
        <Link href='/establecimientos' className='flex items-center gap-1'>
          <ChevronLeft /> Volver
        </Link>
      </Button>
      <FacilityForm userId={user.id} facilityData={facility} />
    </main>
  )
}
