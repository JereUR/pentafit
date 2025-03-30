"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useTodayClientData } from "@/hooks/useTodayClientData"
import { EmptyState } from "./EmptyState"
import { MealList } from "./MealList"

export function TodayNutritionalPlan({ facilityId }: { facilityId: string }) {
  const { isLoading, nutritionData, dayName, error } = useTodayClientData(facilityId)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    )
  }

  if (error) {
    return <div className="p-4 text-sm text-red-500">{error}</div>
  }

  if (!nutritionData) {
    return (
      <EmptyState
        title={`No hay plan de comidas para ${dayName}`}
        description="No tienes comidas programadas para hoy."
        icon="food"
      />
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">{nutritionData.name}</h3>
          <span className="text-sm font-medium text-muted-foreground">{dayName}</span>
        </div>
        {nutritionData.description && <p className="text-sm text-muted-foreground">{nutritionData.description}</p>}
      </div>

      <MealList meals={nutritionData.meals} />
    </div>
  )
}

