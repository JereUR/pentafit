import { redirect } from "next/navigation"
import { Metadata } from "next"

import { validateRequest, validateRole } from "@/auth"
import MyFacilitiesDashboard from "./MyFacilitiesDashboard"

export const metadata: Metadata = {
  title: "Mis establecimientos",
}

export default async function ClientHomePage() {
  const { user } = await validateRequest()
  const roleData = await validateRole()

  if (!user) {
    redirect("/iniciar-sesion")
  }

  if (roleData?.role !== "CLIENT") {
    redirect("/panel-de-control")
  }

  return (
    <main className="flex w-full justify-center gap-5 p-5">
      <MyFacilitiesDashboard user={user} />
    </main>
  )
}

