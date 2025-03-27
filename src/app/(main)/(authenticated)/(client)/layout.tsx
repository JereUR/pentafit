import { redirect } from "next/navigation"

import { validateRequest, validateRole } from "@/auth"
import ClientLayout from "./ClientLayout"

export default async function ClientRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await validateRequest()
  const roleData = await validateRole()

  if (!user || !roleData) {
    redirect("/iniciar-sesion")
  }

  if (roleData.role !== "CLIENT") {
    redirect("/panel-de-control")
  }

  return <ClientLayout userRole={roleData.role}>{children}</ClientLayout>
}