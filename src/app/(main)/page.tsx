import { validateRequest, validateRole } from "@/auth"
import HomePageComponent from "./HomePageComponent"
import NavBar from "@/components/home/NavBar"

export default async function HomePage() {
  const { user } = await validateRequest()
  const role = await validateRole()

  return (
    <>
      <NavBar user={user} role={role?.role || null} />
      <HomePageComponent />
    </>
  )
}
