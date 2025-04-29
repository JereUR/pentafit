"use client"

import { Calendar, CalendarCheck, Utensils, CreditCard, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DashboardSkeletonProps {
  type?: "routine" | "nutrition" | "diary" | "payment" | "invoice" | "full"
}

export function ClientDashboardSkeleton({ type = "full" }: DashboardSkeletonProps) {
  const isMobile = useMediaQuery("(max-width: 767px)")

  const renderCardSkeleton = (cardType: "routine" | "nutrition" | "diary" | "payment" | "invoice") => {
    let icon = <CalendarCheck className="h-6 w-6 text-muted-foreground" />
    let title = "Rutina de Hoy"
    let description = "Tu plan de entrenamiento para hoy"

    switch (cardType) {
      case "nutrition":
        icon = <Utensils className="h-6 w-6 text-muted-foreground" />
        title = "Nutrición de Hoy"
        description = "Tu plan de alimentación para hoy"
        break
      case "diary":
        icon = <Calendar className="h-6 w-6 text-muted-foreground" />
        title = "Clases de Hoy"
        description = "Tus clases programadas para hoy"
        break
      case "payment":
        icon = <CreditCard className="h-6 w-6 text-muted-foreground" />
        title = "Mis Pagos"
        description = "Tus pagos realizados"
        break
      case "invoice":
        icon = <FileText className="h-6 w-6 text-muted-foreground" />
        title = "Mis Facturas"
        description = "Tus facturas generadas"
        break
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

  if (type !== "full") {
    return renderCardSkeleton(type)
  }

  if (isMobile) {
    return (
      <Tabs defaultValue="routine" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="routine">Rutina</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrición</TabsTrigger>
          <TabsTrigger value="diary">Clases</TabsTrigger>
        </TabsList>

        <TabsContent value="routine" className="mt-0">
          {renderCardSkeleton("routine")}
        </TabsContent>
      </Tabs>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {renderCardSkeleton("routine")}
      {renderCardSkeleton("nutrition")}
      {renderCardSkeleton("diary")}
    </div>
  )
}