import { CalendarCheck, Utensils } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardSkeletonProps {
  type: "routine" | "nutrition"
}

export function ClientDashboardSkeleton({ type }: DashboardSkeletonProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        {type === "routine" ? (
          <CalendarCheck className="h-6 w-6 text-muted-foreground" />
        ) : (
          <Utensils className="h-6 w-6 text-muted-foreground" />
        )}
        <div>
          <CardTitle>{type === "routine" ? "Rutina de Hoy" : "Nutrición de Hoy"}</CardTitle>
          <CardDescription>
            {type === "routine" ? "Tu plan de entrenamiento para hoy" : "Tu plan de alimentación para hoy"}
          </CardDescription>
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

