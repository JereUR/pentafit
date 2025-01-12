import { Metadata } from "next"

import { validateRequest } from "@/auth"

export const metadata: Metadata = {
  title: "Agregar establecimiento",
}

export default async function AddFacilityPage() {
  const { user } = await validateRequest()

  if (!user) return null

  return (
    <main className="flex container gap-5 p-5">
      Agregar Establecimiento form
    </main>
  )
}
