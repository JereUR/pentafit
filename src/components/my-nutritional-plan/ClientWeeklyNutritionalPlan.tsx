"use client"

import { Suspense } from "react"

import { ClientDashboardSkeleton } from "@/components/skeletons/ClientDashboardSkeleton"
import { useClientFacility } from "@/contexts/ClientFacilityContext"
import { WeeklyNutritionalPlanView } from "./WeeklyNutritionalPlanView"

interface ClientWeeklyNutritionalPlanProps {
  facilityId: string
}

export function ClientWeeklyNutritionalPlan({ facilityId }: ClientWeeklyNutritionalPlanProps) {
  const { primaryColor } = useClientFacility()

  return (
    <Suspense fallback={<ClientDashboardSkeleton type="nutrition" />}>
      <WeeklyNutritionalPlanView facilityId={facilityId} primaryColor={primaryColor} />
    </Suspense>
  )
}
