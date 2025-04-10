"use client"

import { Suspense } from "react"

import { ClientDashboardSkeleton } from "@/components/skeletons/ClientDashboardSkeleton"
import { useClientFacility } from "@/contexts/ClientFacilityContext"
import { WeeklyRoutineView } from "./WeeklyRoutineView"

interface ClientWeeklyRoutineProps {
  facilityId: string
}

export function ClientWeeklyRoutine({ facilityId }: ClientWeeklyRoutineProps) {
  const { primaryColor } = useClientFacility()

  return (
    <Suspense fallback={<ClientDashboardSkeleton type="routine" />}>
      <WeeklyRoutineView facilityId={facilityId} primaryColor={primaryColor} />
    </Suspense>
  )
}
