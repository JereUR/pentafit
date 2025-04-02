"use client"

import React, { Suspense } from 'react'
import { Calendar, Clock } from 'lucide-react'

import { ClientDashboardSkeleton } from '@/components/skeletons/ClientDashboardSkeleton'
import { useClientFacility } from '@/contexts/ClientFacilityContext'
import { DiaryPlansList } from './DiaryPlansList'
import { UserDiariesList } from './UserDiariesList'

export default function DiaryPlansView({ facilityId }: { facilityId: string }) {
  const { primaryColor, secondaryColor } = useClientFacility()

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<ClientDashboardSkeleton type="routine" />}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" style={{ color: primaryColor }} />
              <h2 className="text-xl font-semibold">Actividades Disponibles</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Estas son las actividades disponibles según tu plan. Puedes inscribirte a las que desees respetando la cantidad de sesiones semanales de tu plan.
            </p>
            <DiaryPlansList facilityId={facilityId} primaryColor={primaryColor} secondaryColor={secondaryColor} />
          </div>
        </Suspense>

        <Suspense fallback={<ClientDashboardSkeleton type="nutrition" />}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" style={{ color: primaryColor }} />
              <h2 className="text-xl font-semibold">Mi Agenda</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Estas son las actividades a las que estás inscrito actualmente. Puedes ver los detalles y horarios de cada una.
            </p>
            <UserDiariesList facilityId={facilityId} primaryColor={primaryColor} secondaryColor={secondaryColor} />
          </div>
        </Suspense>
      </div>
    </div>
  )
}
