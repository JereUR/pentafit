"use client"

import { useDiaryPlans } from "@/hooks/useDiaryPlans"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/dashboard/client/EmptyState"
import { DiaryPlanCard } from "./DiaryPlanCard"

interface DiaryPlansListProps {
  facilityId: string
  primaryColor: string
  secondaryColor: string
}

export function DiaryPlansList({ facilityId, primaryColor, secondaryColor }: DiaryPlansListProps) {
  const { data, isLoading, error } = useDiaryPlans(facilityId)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full rounded-lg" style={{ backgroundColor: `${primaryColor}10` }} />
        <Skeleton className="h-[200px] w-full rounded-lg" style={{ backgroundColor: `${primaryColor}10` }} />
      </div>
    )
  }

  if (error) {
    return <div className="p-4 text-sm text-red-500">Error al cargar las actividades disponibles</div>
  }

  if (!data?.diaryPlans || data.diaryPlans.length === 0) {
    return (
      <EmptyState
        title="No hay actividades disponibles"
        description="No tienes actividades disponibles en tu plan actual."
        icon="workout"
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
      />
    )
  }

  return (
    <div className="space-y-4">
      {data.diaryPlans.map((diaryPlan) => (
        <DiaryPlanCard
          key={diaryPlan.id}
          diaryPlan={diaryPlan}
          facilityId={facilityId}
          primaryColor={primaryColor}
        />
      ))}
    </div>
  )
}
