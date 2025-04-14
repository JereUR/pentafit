import { validateRequest, validateRole } from "@/auth"
import { Role } from "@prisma/client"
import NotFoundCustom from "./NotFoundCustom"

export default async function NotFoundPage() {
  const { user } = await validateRequest()
  const isLoggedIn = !!user

  const roleData = await validateRole()
  const role: Role = roleData?.role ?? Role.CLIENT

  return <NotFoundCustom role={role} isLoggedIn={isLoggedIn} />
}
