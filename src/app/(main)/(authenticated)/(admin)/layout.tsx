import { validateRequest, validateRole } from "@/auth"
import { redirect } from "next/navigation"
import AdminLayout from "./AdminLayout"

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await validateRequest()
  const roleData = await validateRole()

  if (!user || !roleData) {
    redirect("/iniciar-sesion")
  }

  if (roleData.role === "CLIENT") {
    redirect("/mis-establecimientos")
  }

  return <AdminLayout userRole={roleData.role}>{children}</AdminLayout>
}