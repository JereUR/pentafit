import { PrismaAdapter } from "@lucia-auth/adapter-prisma"
import { Lucia, Session, User } from "lucia"
import { cache } from "react"
import { cookies } from "next/headers"
import { Google } from "arctic"

import prisma from "./lib/prisma"
import { MembershipLevel } from "@prisma/client"

const adapter = new PrismaAdapter(prisma.session, prisma.user)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes(databaseUserAttributes) {
    return {
      id: databaseUserAttributes.id,
      firstName: databaseUserAttributes.firstName,
      lastName: databaseUserAttributes.lastName,
      email: databaseUserAttributes.email,
      membershipLevel: databaseUserAttributes.membershipLevel,
      birthday: databaseUserAttributes.birthday,
      gender: databaseUserAttributes.gender,
      avatarUrl: databaseUserAttributes.avatarUrl,
      googleId: databaseUserAttributes.googleId,
    }
  },
})

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

interface DatabaseUserAttributes {
  id: string
  firstName: string
  lastName: string
  email: string | null
  membershipLevel: MembershipLevel
  birthday: string
  gender: string
  avatarUrl: string | null
  googleId: string | null
}

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`,
)

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const cookieStore = await cookies()
    const sessionId =
      (await cookieStore.get(lucia.sessionCookieName))?.value ?? null

    if (!sessionId) {
      return { user: null, session: null }
    }

    const result = await lucia.validateSession(sessionId)

    return result
  },
)

export const validateMembership = cache(
  async (): Promise<{ membership: MembershipLevel } | null> => {
    const { user: loggedInUser } = await validateRequest()

    if (!loggedInUser) {
      return null
    }

    const user = await prisma.user.findFirst({
      where: {
        id: loggedInUser.id,
      },
      select: {
        membershipLevel: true,
      },
    })

    if (!user) {
      return null
    }

    return { membership: user.membershipLevel }
  },
)
