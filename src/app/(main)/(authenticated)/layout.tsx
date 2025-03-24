import type React from "react"
import { validateRequest, validateRole } from "@/auth"
import { redirect } from "next/navigation"
import AuthenticatedLayout from "./authenticated-wrapper"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await validateRequest()
  const role = await validateRole()

  if (!user) {
    redirect("/iniciar-sesion")
  }

  if (user && !children) {
    if (role?.role === "CLIENT") {
      redirect("/inicio")
    } else {
      redirect("/panel-de-control")
    }
  }

  return <AuthenticatedLayout userRole={role?.role || "CLIENT"}>{children}</AuthenticatedLayout>
}

