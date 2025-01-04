import { validateRequest } from "@/auth"
import HomePageComponent from "./HomePageComponent"
import NavBar from "@/components/home/NavBar"

export default async function HomePage() {
  const { user } = await validateRequest()

  return (
    <>
      <NavBar user={user} />
      <HomePageComponent />
    </>
  )
}
