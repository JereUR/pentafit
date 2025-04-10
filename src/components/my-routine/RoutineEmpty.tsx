"use client"

import { CalendarCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import EmptyState from "@/components/EmptyState"

interface RoutineEmptyProps {
  primaryColor: string
  title?: string
  description?: string
}

export function RoutineEmpty({
  primaryColor,
  title = "No tienes una rutina asignada",
  description = "Contacta con tu entrenador para que te asigne una rutina.",
}: RoutineEmptyProps) {
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
        <EmptyState
          title={title}
          description={description}
          icon="workout"
          primaryColor={primaryColor}
          showRedirectButton={false}
        />
      </CardContent>
    </Card>
  )
}
