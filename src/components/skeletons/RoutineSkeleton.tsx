"use client"

import { CalendarCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface RoutineSkeletonProps {
  primaryColor: string
}

export function RoutineSkeleton({ primaryColor }: RoutineSkeletonProps) {
  const colorStyle = primaryColor ? { backgroundColor: `${primaryColor}20` } : {}

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-2">
        <CalendarCheck className="h-6 w-6" style={{ color: primaryColor }} />
        <div>
          <CardTitle>Mi Rutina</CardTitle>
          <CardDescription>Tu plan de entrenamiento semanal</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-4 w-3/4" style={colorStyle} />
          <Skeleton className="h-20 w-full" style={colorStyle} />
          <Skeleton className="h-4 w-1/2" style={colorStyle} />
        </div>
      </CardContent>
    </Card>
  )
}
