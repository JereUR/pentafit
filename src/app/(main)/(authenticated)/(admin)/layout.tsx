import { validateRequest, validateRole } from "@/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await validateRequest()
  const roleData = await validateRole()

  if (!user) {
    redirect("/iniciar-sesion")
  }

  if (roleData?.role === "CLIENT") {
    redirect("/inicio")
  }

  return <>{children}</>
}

