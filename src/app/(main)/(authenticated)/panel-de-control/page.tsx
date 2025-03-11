import type { Metadata } from "next"

import Dashboard from "@/components/dashboard/Dashboard"
import { validateRequest } from "@/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Panel de control",
}

export default async function DashboardPage() {
  const { user } = await validateRequest()

  if (!user) {
    redirect("/iniciar-sesion")
  }

  return (
    <main className="h-full">
      <Dashboard userId={user.id} />
    </main>
  )
}

