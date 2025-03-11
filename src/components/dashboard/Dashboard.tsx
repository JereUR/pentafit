"use client"

import { Building2, Calendar, Users, ClipboardList, UserCircle2, SquareActivity } from "lucide-react"
import { useState } from "react"

import { useFacilities } from "@/hooks/useFacilities"
import { useMetrics } from "@/hooks/useMetrics"
import WorkingFacility from "../WorkingFacility"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import { PlanIcon } from "@/config/icons"
import { LatestTransactions } from "./LatestTransactions"
import { DashboardCard } from "./DashboardCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMediaQuery } from "@/hooks/useMediaQuery"

export default function Dashboard({ userId }: { userId: string }) {
  const { facilities, isLoading: isLoadingFacilities, error: facilitiesError } = useFacilities(userId)
  const { workingFacility } = useWorkingFacility()
  const { data: metrics, isLoading: isLoadingMetrics, error: metricsError } = useMetrics(workingFacility?.id)
  const [activeTab, setActiveTab] = useState<string>("metrics")
  const isMobile = useMediaQuery("(max-width: 768px)")

  if (isMobile) {
    return (
      <section className="flex flex-col h-full">
        <Tabs
          defaultValue="metrics"
          className="w-full h-full flex flex-col"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="metrics">Métricas</TabsTrigger>
            <TabsTrigger value="transactions">Transacciones</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="flex-1 overflow-auto scrollbar-thin">
            <div className="flex flex-col gap-4 w-full">
              <div className='flex justify-center'>
                <WorkingFacility userId={userId} />
              </div>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 items-center">
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
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="flex-1 min-h-0 overflow-hidden">
            {workingFacility && <LatestTransactions facilityId={workingFacility.id} />}
          </TabsContent>
        </Tabs>
      </section>
    )
  }

  return (
    <section className="flex flex-col h-full">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-10 px-1 lg:px-4 md:px-10 w-full">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center order-2 lg:order-1">
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
        <div className="order-1 lg:order-2">
          <WorkingFacility userId={userId} />
        </div>
      </div>
      <div className="flex-1 mt-6 min-h-0">
        {workingFacility && <LatestTransactions facilityId={workingFacility.id} />}
      </div>
    </section>
  )
}

