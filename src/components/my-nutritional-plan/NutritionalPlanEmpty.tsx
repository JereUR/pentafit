"use client"

import { Utensils } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import EmptyState from "@/components/EmptyState"

interface NutritionalPlanEmptyProps {
  primaryColor: string
  title?: string
  description?: string
}

export function NutritionalPlanEmpty({
  primaryColor,
  title = "No tienes un plan nutricional asignado",
  description = "Contacta con tu nutricionista para que te asigne un plan.",
}: NutritionalPlanEmptyProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-2">
        <Utensils className="h-6 w-6" style={{ color: primaryColor }} />
        <div>
          <CardTitle>Mi Plan Nutricional</CardTitle>
          <CardDescription>Tu plan de alimentación semanal</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <EmptyState
          title={title}
          description={description}
          icon="food"
          primaryColor={primaryColor}
          showRedirectButton={false}
        />
      </CardContent>
    </Card>
  )
}
