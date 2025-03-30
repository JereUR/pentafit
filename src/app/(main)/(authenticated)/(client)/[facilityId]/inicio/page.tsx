import { CalendarCheck, Utensils } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { TodayRoutine } from "@/components/dashboard/client/TodayRoutine"
import { TodayNutritionalPlan } from "@/components/dashboard/client/TodayNutritionalPlan"

type Props = {
  params: Promise<{ facilityId: string }>
  searchParams: Promise<{ facilityName?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const facilityName = (await searchParams).facilityName || "Establecimiento"

  return {
    title: `${facilityName} | Mi Establecimiento`,
  }
}

export default async function UserFacilityPage({ params }: Props) {
  const facilityId = (await params).facilityId
  const today = new Date()
  const formattedDate = formatDate(today)

  if (!facilityId) {
    return notFound()
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <p className="text-muted-foreground">{formattedDate}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<DashboardSkeleton type="routine" />}>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <CalendarCheck className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Rutina de Hoy</CardTitle>
                <CardDescription>Tu plan de entrenamiento para hoy</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <TodayRoutine facilityId={facilityId} />
            </CardContent>
          </Card>
        </Suspense>

        <Suspense fallback={<DashboardSkeleton type="nutrition" />}>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Utensils className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Nutrición de Hoy</CardTitle>
                <CardDescription>Tu plan de alimentación para hoy</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <TodayNutritionalPlan facilityId={facilityId} />
            </CardContent>
          </Card>
        </Suspense>
      </div>
    </div>
  )
}

