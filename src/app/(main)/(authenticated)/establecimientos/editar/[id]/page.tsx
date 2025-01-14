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
    <main className="relative container py-8">
      <Link href='/establecimientos' className='absolute top-0 left-0 border border-input rounded-md'>
        <Button variant='ghost'>
          <ChevronLeft /> Volver
        </Button>
      </Link>
      <FacilityForm userId={user.id} facilityData={facility} />
    </main>
  )
}
