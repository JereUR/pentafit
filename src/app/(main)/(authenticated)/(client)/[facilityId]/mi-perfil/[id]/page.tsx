import { Suspense } from 'react'
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { UserProfileSkeleton } from "@/components/skeletons/UserProfileSkeleton"
import { UserProfile } from '@/components/users/UserProfile'

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
      role: true,
      birthday: true,
      avatarUrl: true,
      gender: true,
      facilities: {
        select: {
          facility: {
            select: {
              id: true,
              name: true,
              description: true,
              isActive: true,
              isWorking: true,
              logoUrl: true,
            },
          },
        }
      },
      createdAt: true
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

  return (
    <main className="flex container gap-5 p-5">
      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfileContent userId={loggedUser.id} />
      </Suspense>
    </main>
  )
}

async function UserProfileContent({ userId }: { userId: string }) {
  const user = await getUser(userId)
  return <UserProfile user={user} loggedUserId={userId} />
}

