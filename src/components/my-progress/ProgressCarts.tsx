import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressChart } from "./ProgressChart"
import { ProgressData } from "@/types/progress"

interface ProgressChartsProps {
  progressData: ProgressData | null
  primaryColor: string
}

export function ProgressCharts({ progressData, primaryColor }: ProgressChartsProps) {
  if (!progressData || !progressData.historical) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay datos históricos disponibles</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolución de tu Progreso</CardTitle>
        <CardDescription>Visualiza tu progreso a lo largo del tiempo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ProgressChart
            data={progressData.historical}
            primaryColor={primaryColor}
            showLegend={true}
            showTooltip={true}
          />
        </div>
      </CardContent>
    </Card>
  )
}
