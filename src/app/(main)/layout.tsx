import { validateRequest } from "@/auth"
import SessionProvider from "./SessionProvider"
import NavBar from "./NavBar"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, session } = await validateRequest()

  return (
    <SessionProvider value={{ user, session }}>
      <div className="flex min-h-screen flex-col">
        <NavBar />
        {children}
      </div>
    </SessionProvider>
  )
}

