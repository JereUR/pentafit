"use client"

import type React from "react"
import { Building2, Calendar, Users, ClipboardList, UserCircle2, SquareActivity } from 'lucide-react'

import { useFacilities } from "@/hooks/useFacilities"
import { useMetrics } from "@/hooks/useMetrics"
import WorkingFacility from "../WorkingFacility"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import { PlanIcon } from "@/config/icons"
import { LatestTransactions } from "./LatestTransactions"
import { DashboardCard } from "./DashboardCard"

export default function Dashboard({ userId }: { userId: string }) {
  const { facilities, isLoading: isLoadingFacilities, error: facilitiesError } = useFacilities(userId)
  const { workingFacility } = useWorkingFacility()
  const { data: metrics, isLoading: isLoadingMetrics, error: metricsError } = useMetrics(workingFacility?.id)

  return (
    <section>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-10 px-1 lg:px-4 md:px-10 w-full">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center">
          <DashboardCard
            id={0}
            title="Establecimientos activos"
            icon={<Building2 />}
            value={facilities?.filter((f) => f.isActive).length}
            loading={isLoadingFacilities}
            error={facilitiesError}
          />
          <DashboardCard
            id={1}
            title="Actividades activas"
            icon={<ClipboardList />}
            value={metrics?.activeActivities}
            loading={isLoadingMetrics}
            error={metricsError}
          />
          <DashboardCard
            id={2}
            title="Planes vigentes"
            icon={<PlanIcon className="text-amber-400" />}
            value={metrics?.currentPlans}
            loading={isLoadingMetrics}
            error={metricsError}
          />
          <DashboardCard
            id={3}
            title="Agendas activas"
            icon={<Calendar />}
            value={metrics?.activeDiaries}
            loading={isLoadingMetrics}
            error={metricsError}
          />
          <DashboardCard
            id={4}
            title="Miembros del equipo"
            icon={<Users />}
            value={metrics?.teamMembers}
            loading={isLoadingMetrics}
            error={metricsError}
          />
          <DashboardCard
            id={5}
            title="Clientes activos"
            icon={<UserCircle2 />}
            value={metrics?.clientMembers}
            loading={isLoadingMetrics}
            error={metricsError}
          />
          <DashboardCard
            id={6}
            title="Rutinas activas"
            icon={<SquareActivity />}
            value={metrics?.activeRoutines}
            loading={isLoadingMetrics}
            error={metricsError}
          />
        </div>
        <WorkingFacility userId={userId} />
      </div>
      {workingFacility && <LatestTransactions facilityId={workingFacility.id} />}
    </section>
  )
}