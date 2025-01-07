import { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { UserProfile } from "./UserProfile"

interface UserPageProps {
  params: Promise<{ id: string }>
}

const getUser = cache(async (id: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: {
        equals: id,
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      membershipLevel: true,
      email: true,
      birthday: true,
      avatarUrl: true,
      gender: true,
      createdAt:true
    }
  })

  if (!user) notFound()

  return user
})

export async function generateMetadata(
  { params }: UserPageProps,
): Promise<Metadata> {
  const { id } = await params
  const { user: loggedInUser } = await validateRequest()

  if (!loggedInUser) return {}

  const user = await getUser(id)

  return {
    title: `${user.firstName} ${user.lastName}`,
  }
}

export default async function UserPage() {
  const { user: loggedUser } = await validateRequest()

  if (!loggedUser) return null

  const user = await getUser(loggedUser.id)
  return (
    <main className="flex w-full min-w-0 gap-5">
      <UserProfile user={user} loggedUserId={loggedUser.id} />
    </main>
  )
}
