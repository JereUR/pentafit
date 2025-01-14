import { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { validateRequest } from "@/auth"
import FacilityForm from "@/components/facilities/FacilityForm"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Agregar establecimiento",
}

export default async function AddFacilityPage() {
  const { user } = await validateRequest()

  if (!user) {
    redirect("/login")
  }

  return (
    <main className="md:relative container py-8">
      <Button variant='ghost' className='mb-2 md:mb-0 md:absolute md:top-0 md:left-0 border border-input'>
        <Link href='/establecimientos' className='flex items-center gap-1'>
          <ChevronLeft /> Volver
        </Link>
      </Button>
      <FacilityForm userId={user.id} />
    </main>
  )
}

