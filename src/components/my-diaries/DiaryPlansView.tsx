"use client"

import { Suspense } from "react"
import { Calendar, Clock } from "lucide-react"

import { ClientDashboardSkeleton } from "@/components/skeletons/ClientDashboardSkeleton"
import { DiaryPlansList } from "./DiaryPlansList"
import { UserDiariesList } from "./UserDiariesList"

interface DiaryPlansViewProps {
  facilityId: string
  primaryColor: string
}

export default function DiaryPlansView({ facilityId, primaryColor }: DiaryPlansViewProps) {
  return (
    <div className="space-y-8 px-2 sm:px-4 pb-2 lg:pb-4">
      <div className="grid gap-8 lg:grid-cols-2">
        <Suspense fallback={<ClientDashboardSkeleton type="routine" />}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 flex-shrink-0" style={{ color: primaryColor }} />
              <h2 className="text-lg sm:text-xl font-semibold truncate">Actividades Disponibles</h2>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Estas son las actividades disponibles según tu plan. Puedes inscribirte a las que desees respetando la
              cantidad de sesiones semanales de tu plan.
            </p>
            <DiaryPlansList facilityId={facilityId} primaryColor={primaryColor} />
          </div>
        </Suspense>

        <Suspense fallback={<ClientDashboardSkeleton type="nutrition" />}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 flex-shrink-0" style={{ color: primaryColor }} />
              <h2 className="text-lg sm:text-xl font-semibold truncate">Mi Agenda</h2>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Estas son las actividades a las que estás inscrito actualmente. Puedes ver los detalles y horarios de cada
              una.
            </p>
            <UserDiariesList facilityId={facilityId} primaryColor={primaryColor} />
          </div>
        </Suspense>
      </div>
    </div>
  )
}

