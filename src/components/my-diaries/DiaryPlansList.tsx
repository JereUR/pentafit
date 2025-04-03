"use client"

import { useDiaryPlans } from "@/hooks/useDiaryPlans"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/EmptyState"
import { DiaryPlanCard } from "./DiaryPlanCard"

interface DiaryPlansListProps {
  facilityId: string
  primaryColor: string
}

export function DiaryPlansList({ facilityId, primaryColor }: DiaryPlansListProps) {
  const { data, isLoading, error } = useDiaryPlans(facilityId)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton
          className="h-[150px] sm:h-[180px] w-full rounded-lg"
          style={{ backgroundColor: `${primaryColor}10` }}
        />
        <Skeleton
          className="h-[150px] sm:h-[180px] w-full rounded-lg"
          style={{ backgroundColor: `${primaryColor}10` }}
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-3 sm:p-4 text-xs sm:text-sm text-red-500 bg-red-50 rounded-lg">
        Error al cargar las actividades disponibles
      </div>
    )
  }

  if (!data?.diaryPlans || data.diaryPlans.length === 0) {
    return (
      <EmptyState
        title="No hay actividades disponibles"
        description="No tienes actividades disponibles en tu plan actual."
        icon="workout"
        primaryColor={primaryColor}
        showRedirectButton={false}
      />
    )
  }

  return (
    <div className="space-y-4">
      {data.diaryPlans.map((diaryPlan) => (
        <DiaryPlanCard key={diaryPlan.id} diaryPlan={diaryPlan} facilityId={facilityId} primaryColor={primaryColor} />
      ))}
    </div>
  )
}

