"use client"

import { Utensils } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface NutritionalPlanSkeletonProps {
  primaryColor: string
}

export function NutritionalPlanSkeleton({ primaryColor }: NutritionalPlanSkeletonProps) {
  const colorStyle = primaryColor ? { backgroundColor: `${primaryColor}20` } : {}

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
        <div className="space-y-4">
          <Skeleton className="h-4 w-3/4" style={colorStyle} />
          <Skeleton className="h-20 w-full" style={colorStyle} />
          <Skeleton className="h-4 w-1/2" style={colorStyle} />
        </div>
      </CardContent>
    </Card>
  )
}
