import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ProgressCardProps {
  title: string
  value: number
  icon: React.ReactNode
  description: string
  primaryColor: string
  isOverall?: boolean
}

export function ProgressCard({ title, value, icon, description, primaryColor, isOverall = false }: ProgressCardProps) {
  // Function to determine color based on progress value
  const getProgressColor = (value: number) => {
    if (isOverall) return primaryColor
    if (value < 30) return "#ef4444" // Red for low progress
    if (value < 70) return "#f97316" // Orange for medium progress
    return "#22c55e" // Green for good progress
  }

  const progressColor = getProgressColor(value)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div
          className="h-6 w-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${primaryColor}20` }}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{Math.round(value)}%</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <Progress
          value={value}
          className="h-2 mt-3"
          style={
            {
              "--progress-foreground": progressColor,
            } as React.CSSProperties
          }
        />
      </CardContent>
    </Card>
  )
}
