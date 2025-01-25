import { Analytics } from '@vercel/analytics/next'

import { validateRequest } from "@/auth"
import SessionProvider from "./SessionProvider"
import { ClientAuthCheck } from "@/components/ClientAuthCheck"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, session } = await validateRequest()

  return (
    <SessionProvider value={{ user, session }}>
      <ClientAuthCheck user={user}>
        <div className="flex min-h-screen flex-col">
          {children}
          <Analytics />
        </div>
      </ClientAuthCheck>
    </SessionProvider>
  )
}

