"use client"

import { Suspense } from "react"

import { UserProfileSkeleton } from "@/components/skeletons/UserProfileSkeleton"
import { useClientFacility } from "@/contexts/ClientFacilityContext"
import type { ClientUserProfileData } from "@/types/user"
import { ClientUserProfile } from "@/components/users/ClientUserProfile"

interface ProfileClientProps {
  user: ClientUserProfileData
  userId: string
  isOwnProfile: boolean
}

export default function ProfileClient({ user, userId, isOwnProfile }: ProfileClientProps) {
  const { primaryColor } = useClientFacility()

  return (
    <Suspense fallback={<UserProfileSkeleton />}>
      <ClientUserProfile user={user} loggedUserId={userId} primaryColor={primaryColor} isOwnProfile={isOwnProfile} />
    </Suspense>
  )
}
