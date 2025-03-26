import { validateRequest, validateRole } from "@/auth"
import { redirect } from "next/navigation"
import Dashboard from "@/components/dashboard/Dashboard"

export default async function DashboardPage() {
  const { user } = await validateRequest()
  const roleData = await validateRole()

  if (!user) {
    redirect("/iniciar-sesion")
  }

  if (roleData?.role === "CLIENT") {
    redirect("/mis-establecimientos")
  }

  return (
    <main className="h-full">
      <Dashboard userId={user.id} />
    </main>
  )
}

