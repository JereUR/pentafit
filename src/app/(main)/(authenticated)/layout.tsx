import { validateRole } from "@/auth"
import AuthenticatedLayout from "./authenticated-wrapper"

export default async function AuthenticatedWrapper({ children }: { children: React.ReactNode }) {
  const { role } = (await validateRole()) || { role: "DEFAULT" }

  return <AuthenticatedLayout userRole={role}>{children}</AuthenticatedLayout>
}