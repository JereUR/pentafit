"use client"

import { useState } from "react"

import { useClientFacility } from "@/contexts/ClientFacilityContext"
import { useUserProgress } from "@/hooks/useUserProgress"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ProgressSkeleton } from "../skeletons/ProgressSkeleton"
import { MeasurementDialog } from "./MeasurementDialog"
import { ProgressOverview } from "./ProgressOverview"
import { ProgressCharts } from "./ProgressCarts"
import { ProgressData } from "@/types/progress"
import { MeasurementsView } from "./MeasurementView"


interface ProgressDashboardProps {
  facilityId: string
}

export default function ProgressDashboard({ facilityId }: ProgressDashboardProps) {
  const { primaryColor } = useClientFacility()
  const { progressData, isLoading, error } = useUserProgress(facilityId)
  const [activeTab, setActiveTab] = useState("overview")

  if (isLoading) {
    return <ProgressSkeleton />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <h2 className="text-xl font-semibold mb-2">Error al cargar los datos</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()} style={{ backgroundColor: primaryColor }}>
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Seguimiento de Progreso</h2>
          <p className="text-muted-foreground">Visualiza tu evolución física y rendimiento</p>
        </div>
        <MeasurementDialog facilityId={facilityId} primaryColor={primaryColor} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger
            value="overview"
            style={activeTab === "overview" ? { backgroundColor: primaryColor, color: "white" } : {}}
          >
            General
          </TabsTrigger>
          <TabsTrigger
            value="charts"
            style={activeTab === "charts" ? { backgroundColor: primaryColor, color: "white" } : {}}
          >
            Gráficos
          </TabsTrigger>
          <TabsTrigger
            value="measurements"
            style={activeTab === "measurements" ? { backgroundColor: primaryColor, color: "white" } : {}}
          >
            Medidas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <ProgressOverview progressData={progressData as ProgressData | null} primaryColor={primaryColor} />
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <ProgressCharts progressData={progressData as ProgressData | null} primaryColor={primaryColor} />
        </TabsContent>

        <TabsContent value="measurements" className="space-y-4">
          <MeasurementsView progressData={progressData as ProgressData | null} primaryColor={primaryColor} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
