"use client"

import type React from "react"
import { Building2, Calendar, Users, ClipboardList, Loader2, UserCircle2 } from 'lucide-react'

import { useFacilities } from "@/hooks/useFacilities"
import { useMetrics } from "@/hooks/useMetrics"
import { Card, CardContent } from "@/components/ui/card"
import WorkingFacility from "../WorkingFacility"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import { PlanIcon } from "@/config/icons"

export default function Dashboard({ userId }: { userId: string }) {
  const { facilities, isLoading: isLoadingFacilities, error: facilitiesError } = useFacilities(userId)
  const { workingFacility } = useWorkingFacility()
  const { data: metrics, isLoading: isLoadingMetrics, error: metricsError } = useMetrics(workingFacility?.id)

  return (
    <div className="flex flex-col lg:fle-row gap-4 lg:gap-6 px-1 lg:px-4 md:px-10 w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <DashboardCard
          id={0}
          title="Establecimientos activos"
          icon={<Building2 className="h-8 w-8 mr-4" />}
          value={facilities?.filter((f) => f.isActive).length}
          loading={isLoadingFacilities}
          error={facilitiesError}
        />
        <DashboardCard
          id={1}
          title="Actividades activas"
          icon={<ClipboardList className="h-8 w-8 mr-4" />}
          value={metrics?.activeActivities}
          loading={isLoadingMetrics}
          error={metricsError}
        />
        <DashboardCard
          id={2}
          title="Planes vigentes"
          icon={<PlanIcon className="h-8 w-8 mr-4" />}
          value={metrics?.currentPlans}
          loading={isLoadingMetrics}
          error={metricsError}
        />
        <DashboardCard
          id={3}
          title="Agendas activas"
          icon={<Calendar className="h-8 w-8 mr-4" />}
          value={metrics?.activeDiaries}
          loading={isLoadingMetrics}
          error={metricsError}
        />
        <DashboardCard
          id={4}
          title="Miembros del equipo"
          icon={<Users className="h-8 w-8 mr-4" />}
          value={metrics?.teamMembers}
          loading={isLoadingMetrics}
          error={metricsError}
        />
        <DashboardCard
          id={5}
          title="Clientes activos"
          icon={<UserCircle2 className="h-8 w-8 mr-4" />}
          value={metrics?.clientMembers}
          loading={isLoadingMetrics}
          error={metricsError}
        />
      </div>
      <WorkingFacility userId={userId} />
    </div>
  )
}

interface DashboardContentProps {
  id: number
  title: string
  icon: React.ReactNode
  value: number | undefined
  loading: boolean
  error: Error | null
}

export function DashboardCard({ id, title, icon, value, loading, error }: DashboardContentProps) {
  if (error) {
    return (
      <Card key={id} className="w-full border-2 border-primary shadow-md">
        <CardContent className="flex flex-col justify-between h-[120px] p-4">
          <div className="flex w-full items-center gap-4 text-primary">
            {icon}
            <span className="md:text-xl font-bold text-center">{title}</span>
          </div>
          <div className="flex justify-center items-end mt-2">
            <span className="text-lg font-semibold text-foreground">Error al cargar datos</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card key={id} className="w-full border-primary shadow-md">
      <CardContent className="flex flex-col justify-between h-[120px] p-4">
        <div className="flex items-center gap-2 text-primary">
          {icon}
          <span className="md:text-xl font-bold">{title}</span>
        </div>
        {loading ? (
          <Loader2 className="mx-auto animate-spin" />
        ) : (
          <div className="flex justify-center items-end">
            <span className="text-2xl md:text-3xl font-semibold text-foreground">{value || 0}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}