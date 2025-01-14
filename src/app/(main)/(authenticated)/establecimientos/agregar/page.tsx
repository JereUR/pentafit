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
    <main className="relative container py-8">
      <Link href='/establecimientos' className='absolute top-0 left-0 border border-input rounded-md'>
        <Button variant='ghost'>
          <ChevronLeft /> Volver
        </Button>
      </Link>
      <FacilityForm userId={user.id} />
    </main>
  )
}

