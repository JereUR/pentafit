import { Calendar, CalendarCheck, Utensils } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardSkeletonProps {
  type: "routine" | "nutrition" | "diary"
}

export function ClientDashboardSkeleton({ type }: DashboardSkeletonProps) {
  let icon = <CalendarCheck className="h-6 w-6 text-muted-foreground" />
  let title = "Rutina de Hoy"
  let description = "Tu plan de entrenamiento para hoy"

  if (type === "nutrition") {
    icon = <Utensils className="h-6 w-6 text-muted-foreground" />
    title = "Nutrición de Hoy"
    description = "Tu plan de alimentación para hoy"
  } else if (type === "diary") {
    icon = <Calendar className="h-6 w-6 text-muted-foreground" />
    title = "Clases de Hoy"
    description = "Tus clases programadas para hoy"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        {icon}
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-4 w-3/4 bg-muted/20" />
          <Skeleton className="h-20 w-full bg-muted/20" />
          <Skeleton className="h-4 w-1/2 bg-muted/20" />
        </div>
      </CardContent>
    </Card>
  )
}

