'use client'

import { Suspense } from "react"

import { UserProfileSkeleton } from "@/components/skeletons/UserProfileSkeleton"
import { UserProfile } from "@/components/users/UserProfile"
import { useClientFacility } from "@/contexts/ClientFacilityContext"
import { UserData } from "@/types/user"

interface ProfileClientProps {
  user: UserData
  userId: string
}

export default function ProfileClient({ user, userId }: ProfileClientProps) {
  const { primaryColor } = useClientFacility()

  return (
    <Suspense fallback={<UserProfileSkeleton />}>
      <UserProfile user={user} loggedUserId={userId} primaryColor={primaryColor} />
    </Suspense>
  )
}
