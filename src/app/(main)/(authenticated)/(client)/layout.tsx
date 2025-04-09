import { redirect } from "next/navigation"

import { validateRequest, validateRole } from "@/auth"
import ClientLayout from "./ClientLayout"
import { ClientFacilityProvider } from "@/contexts/ClientFacilityContext"

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

  return (
  <ClientFacilityProvider>
    <ClientLayout userRole={roleData.role}>{children}</ClientLayout>
  </ClientFacilityProvider>)
}