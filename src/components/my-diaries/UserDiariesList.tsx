"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/dashboard/client/EmptyState"
import { UserDiaryCard } from "./UserDiaryCard"
import { useUserDiaries } from "@/hooks/useUserDiaries"

interface UserDiariesListProps {
  facilityId: string
  primaryColor: string
  secondaryColor: string
}

export function UserDiariesList({ facilityId, primaryColor, secondaryColor }: UserDiariesListProps) {
  const { data, isLoading, error } = useUserDiaries(facilityId)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[150px] w-full rounded-lg" style={{ backgroundColor: `${primaryColor}10` }} />
        <Skeleton className="h-[150px] w-full rounded-lg" style={{ backgroundColor: `${primaryColor}10` }} />
      </div>
    )
  }

  if (error) {
    return <div className="p-4 text-sm text-red-500">Error al cargar tus actividades</div>
  }

  if (!data?.userDiaries || data.userDiaries.length === 0) {
    return (
      <EmptyState
        title="No estás inscrito a ninguna actividad"
        description="Inscríbete a las actividades disponibles para comenzar a crear tu agenda."
        icon="workout"
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
      />
    )
  }

  return (
    <div className="space-y-4">
      {data.userDiaries.map((userDiary) => (
        <UserDiaryCard
          key={userDiary.id}
          userDiary={userDiary}
          facilityId={facilityId}
          primaryColor={primaryColor}
        />
      ))}
    </div>
  )
}
