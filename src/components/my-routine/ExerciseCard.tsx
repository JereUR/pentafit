"use client"

import { Dumbbell } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { ExerciseData } from "@/types/routine"
import noImage from "@/assets/no-image.png"

interface ExerciseCardProps {
  exercise: ExerciseData
  primaryColor: string
  exerciseNumber?: number
}

export function ExerciseCard({ exercise, primaryColor, exerciseNumber }: ExerciseCardProps) {
  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-0">
        {exercise.photoUrl && (
          <div className="h-40 w-full bg-card/50">
            <Image
              src={exercise.photoUrl || noImage}
              alt={exercise.name}
              height={160}
              width={320}
              className="h-full w-full object-contain"
            />
          </div>
        )}
        <div className="p-3">
          {exerciseNumber !== undefined && (
            <div className="mb-2">
              <Badge
                variant="outline"
                className="text-xs font-medium"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                Ejercicio N°{exerciseNumber}
              </Badge>
            </div>
          )}
          <div className="flex items-start gap-2 mb-2">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <Dumbbell className="h-4 w-4" style={{ color: primaryColor }} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <h4 className="font-medium text-sm truncate">{exercise.name}</h4>
                <Badge variant="outline" className="text-xs self-start sm:self-auto">
                  {exercise.bodyZone}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
            <span>{exercise.series} series</span>
            <span>•</span>
            <span>
              {exercise.count} {exercise.measure}
            </span>
            {exercise.rest && (
              <>
                <span>•</span>
                <span>{exercise.rest}s rest</span>
              </>
            )}
          </div>
          {exercise.description && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{exercise.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
