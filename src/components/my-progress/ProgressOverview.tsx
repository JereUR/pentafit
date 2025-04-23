import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Activity, Calendar, Dumbbell, Utensils } from "lucide-react"
import { useState } from "react"
import { useTheme } from "next-themes"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressCard } from "./ProgressCard"
import type { ProgressData } from "@/types/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProgressChart } from "./ProgressChart"

interface ProgressOverviewProps {
  progressData: ProgressData | null
  primaryColor: string
}

export function ProgressOverview({ progressData, primaryColor }: ProgressOverviewProps) {
  const [chartType, setChartType] = useState<"bar" | "line">("bar")
  const {theme} = useTheme()

  if (!progressData) return null

  const lastUpdated = progressData.lastUpdated
    ? format(new Date(progressData.lastUpdated), "d 'de' MMMM, yyyy", { locale: es })
    : "No disponible"

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ProgressCard
          title="Rutina"
          value={progressData.routine}
          icon={<Dumbbell className="h-4 w-4" />}
          description="Ejercicios completados"
          primaryColor={primaryColor}
        />

        <ProgressCard
          title="Nutrición"
          value={progressData.nutrition}
          icon={<Utensils className="h-4 w-4" />}
          description="Adherencia al plan"
          primaryColor={primaryColor}
        />

        <ProgressCard
          title="Clases"
          value={progressData.classes}
          icon={<Calendar className="h-4 w-4" />}
          description="Asistencia a actividades"
          primaryColor={primaryColor}
        />

        <ProgressCard
          title="Progreso General"
          value={progressData.overall}
          icon={<Activity className="h-4 w-4" />}
          description="Rendimiento global"
          primaryColor={primaryColor}
          isOverall={true}
        />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Resumen de Actividad Reciente</CardTitle>
              <CardDescription>Tu progreso en las últimas semanas</CardDescription>
            </div>
            <Tabs
              value={chartType}
              onValueChange={(value) => setChartType(value as "bar" | "line")}
              className="mt-2 sm:mt-0"
            >
              <TabsList className="grid w-[180px] grid-cols-2">
                <TabsTrigger
                  value="bar"
                  style={{
                    backgroundColor: chartType === "bar" ? primaryColor : "transparent",
                    color: chartType === "bar" ? "#ffffff" : "inherit",
                  }}
                >
                  Barras
                </TabsTrigger>
                <TabsTrigger
                  value="line"
                  style={{
                    backgroundColor: chartType === "line" ? primaryColor : "transparent",
                    color: chartType === "line" ? "#ffffff" : "inherit",
                  }}
                >
                  Líneas
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] overflow-visible">
            <ProgressChart
              data={progressData.historical}
              primaryColor={primaryColor}
              chartType={chartType}
              showLegend={true}
              showTooltip={true}
              theme={theme} 
            />
          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">Última actualización: {lastUpdated}</CardFooter>
      </Card>
    </>
  )
}

export default ProgressOverview