import { Metadata } from "next"
import { validateRequest } from "@/auth"
import { redirect } from "next/navigation"
import FacilityForm from "@/components/facilities/FacilityForm"

export const metadata: Metadata = {
  title: "Agregar establecimiento",
}

export default async function AddFacilityPage() {
  const { user } = await validateRequest()

  if (!user) {
    redirect("/login")
  }

  return (
    <main className="container py-8">
      <FacilityForm userId={user.id} />
    </main>
  )
}

