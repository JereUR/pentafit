import { useState } from "react"
import { useTheme } from "next-themes"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProgressChart } from "./ProgressChart"
import type { ProgressData } from "@/types/progress"

interface ProgressChartsProps {
  progressData: ProgressData | null
  primaryColor: string
}

export function ProgressCharts({ progressData, primaryColor }: ProgressChartsProps) {
  const [timeRange, setTimeRange] = useState<string>("all")
  const { theme } = useTheme()

  if (!progressData || !progressData.historical) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay datos históricos disponibles</p>
      </div>
    )
  }

  const getFilteredData = () => {
    if (timeRange === "all" || !progressData.historical) return progressData.historical

    const now = new Date()
    const filtered: Record<string, (typeof progressData.historical)[string]> = {}

    let cutoffDate: Date
    switch (timeRange) {
      case "week":
        cutoffDate = new Date(now.setDate(now.getDate() - 7))
        break
      case "month":
        cutoffDate = new Date(now.setDate(now.getDate() - 30))
        break
      default:
        return progressData.historical
    }

    Object.entries(progressData.historical).forEach(([key, dataPoints]) => {
      filtered[key] = dataPoints.filter((point) => new Date(point.date) >= cutoffDate)
    })

    return filtered
  }

  const filteredData = getFilteredData()

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Evolución de tu Progreso</CardTitle>
            <CardDescription>Visualiza tu progreso a lo largo del tiempo</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Último mes</SelectItem>
                <SelectItem value="all">Todo el período</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] overflow-visible">
          <ProgressChart
            data={filteredData}
            primaryColor={primaryColor}
            showLegend={true}
            showTooltip={true}
            theme={theme}
          />
        </div>
      </CardContent>
    </Card>
  )
}