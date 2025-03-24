import { validateRequest, validateRole } from "@/auth"
import { redirect } from "next/navigation"

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
    <main className="h-full">
      Hola {user.firstName} {user.lastName}
    </main>
  )
}

