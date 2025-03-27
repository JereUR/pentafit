import { validateRequest, validateRole } from "@/auth"
import { redirect } from "next/navigation"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await validateRequest()
  const roleData = await validateRole()

  if (!user || !roleData) {
    redirect("/iniciar-sesion")
  }

  if (user && !children) {
    if (roleData.role === "CLIENT") {
      redirect("/mis-establecimientos")
    } else {
      redirect("/panel-de-control")
    }
  }

  return <>{children}</>
}