'use client'

import { CalendarCheck, Utensils } from 'lucide-react'
import React, { Suspense } from 'react'

import { ClientDashboardSkeleton } from '@/components/skeletons/ClientDashboardSkeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TodayRoutine } from './TodayRoutine'
import { TodayNutritionalPlan } from './TodayNutritionalPlan'
import { useClientFacility } from '@/contexts/ClientFacilityContext'

export default function ClientDashboard({ facilityId }: { facilityId: string }) {
  const { primaryColor, secondaryColor } = useClientFacility()

  return (
    <div className="grid gap-6 md:grid-cols-2">
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
            <TodayRoutine facilityId={facilityId} primaryColor={primaryColor} secondaryColor={secondaryColor} />
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
            <TodayNutritionalPlan facilityId={facilityId} primaryColor={primaryColor} secondaryColor={secondaryColor} />
          </CardContent>
        </Card>
      </Suspense>
    </div>
  )
}
