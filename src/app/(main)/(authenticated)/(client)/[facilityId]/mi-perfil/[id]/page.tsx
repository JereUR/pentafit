import { cache } from "react"
import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import ProfileClient from "./ProfileClient"

interface UserPageProps {
  params: Promise<{ id: string; facilityId: string }>
}

const getUser = cache(async (id: string, facilityId: string, isOwnProfile = false) => {
  const facility = await prisma.facility.findUnique({
    where: {
      id: facilityId,
    },
    select: {
      name: true,
    },
  })

  if (!facility) notFound()

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
      email: true,
      birthday: true,
      avatarUrl: true,
      gender: true,
      plan: {
        where: {
          isActive: true,
          plan: {
            facilityId: facilityId,
          },
        },
        select: {
          plan: {
            select: {
              id: true,
              name: true,
              price: true,
              paymentTypes: true,
              diaryPlans: {
                select: {
                  id: true,
                  name: true,
                  daysOfWeek: true,
                  sessionsPerWeek: true,
                  vacancies: true,
                  activity: {
                    select: {
                      name: true,
                      description: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      createdAt: true,
      ...(isOwnProfile && {
        measurements: {
          where: {
            facilityId: facilityId,
          },
          orderBy: {
            date: "desc",
          },
          take: 5,
          select: {
            id: true,
            date: true,
            weight: true,
            height: true,
            bodyFat: true,
            muscle: true,
            chest: true,
            waist: true,
            hips: true,
            arms: true,
            thighs: true,
            notes: true,
          },
        },
      }),
    },
  })

  if (!user) notFound()

  return {
    user,
    facilityName: facility.name,
  }
})

export async function generateMetadata({ params }: UserPageProps): Promise<Metadata> {
  const { id, facilityId } = await params
  const { user: loggedInUser } = await validateRequest()

  if (!loggedInUser) return {}

  const { user, facilityName } = await getUser(id, facilityId)

  return {
    title: `${user.firstName} ${user.lastName} | ${facilityName}`,
  }
}

export default async function UserPage({ params }: UserPageProps) {
  const { user: loggedUser } = await validateRequest()

  if (!loggedUser) redirect("/iniciar-sesion")

  const { id, facilityId } = await params

  const isOwnProfile = loggedUser.id === id

  return (
    <main className="flex container gap-5 p-5">
      <UserProfileContent
        userId={id}
        facilityId={facilityId}
        isOwnProfile={isOwnProfile}
        loggedUserId={loggedUser.id}
      />
    </main>
  )
}

async function UserProfileContent({
  userId,
  facilityId,
  isOwnProfile,
  loggedUserId,
}: {
  userId: string
  facilityId: string
  isOwnProfile: boolean
  loggedUserId: string
}) {
  const { user } = await getUser(userId, facilityId, isOwnProfile)
  return <ProfileClient user={user} userId={loggedUserId} isOwnProfile={isOwnProfile} />
}
