"use client"

import { CalendarCheck, Utensils, Calendar } from "lucide-react"
import { Suspense } from "react"

import { ClientDashboardSkeleton } from "@/components/skeletons/ClientDashboardSkeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TodayRoutine } from "./TodayRoutine"
import { TodayNutritionalPlan } from "./TodayNutritionalPlan"
import { TodayDiary } from "./TodayDiary"
import { useClientFacility } from "@/contexts/ClientFacilityContext"

export default function ClientDashboard({ facilityId }: { facilityId: string }) {
  const { primaryColor } = useClientFacility()

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Suspense fallback={<ClientDashboardSkeleton type="routine" />}>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <CalendarCheck className="h-6 w-6" style={{ color: primaryColor }} />
            <div>
              <CardTitle>Rutina de Hoy</CardTitle>
              <CardDescription>Tu plan de entrenamiento para hoy</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <TodayRoutine facilityId={facilityId} primaryColor={primaryColor} />
          </CardContent>
        </Card>
      </Suspense>

      <Suspense fallback={<ClientDashboardSkeleton type="nutrition" />}>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Utensils className="h-6 w-6" style={{ color: primaryColor }} />
            <div>
              <CardTitle>Nutrición de Hoy</CardTitle>
              <CardDescription>Tu plan de alimentación para hoy</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <TodayNutritionalPlan facilityId={facilityId} primaryColor={primaryColor} />
          </CardContent>
        </Card>
      </Suspense>
      <Suspense fallback={<ClientDashboardSkeleton type="diary" />}>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Calendar className="h-6 w-6" style={{ color: primaryColor }} />
            <div>
              <CardTitle>Clases de Hoy</CardTitle>
              <CardDescription>Tus clases programadas para hoy</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <TodayDiary facilityId={facilityId} primaryColor={primaryColor} />
          </CardContent>
        </Card>
      </Suspense>
    </div>
  )
}

