import { redirect } from "next/navigation"

import { validateRequest, validateRole } from "@/auth"

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await validateRequest()
  const roleData = await validateRole()

  if (!user) {
    redirect("/iniciar-sesion")
  }

  if (roleData?.role !== "CLIENT") {
    redirect("/panel-de-control")
  }

  return <>{children}</>
}

