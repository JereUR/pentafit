"use client"

import { useState, useEffect } from "react"
import { Dumbbell, Loader2 } from "lucide-react"
import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import noImage from "@/assets/no-image.png"
import { useCompleteExerciseMutation } from "@/app/(main)/(authenticated)/(client)/[facilityId]/mi-progreso/mutations"
import { isDayTodayOrPast } from "@/lib/utils"
import { ExerciseData } from "@/types/routineClient"

interface ExerciseCardProps {
  exercise: ExerciseData
  primaryColor: string
  exerciseNumber?: number
  routineId: string
  facilityId: string
  dayOfWeek: string
  onExerciseToggle?: (exerciseId: string, completed: boolean) => void
}

export function ExerciseCard({
  exercise,
  primaryColor,
  exerciseNumber,
  routineId,
  facilityId,
  dayOfWeek,
  onExerciseToggle,
}: ExerciseCardProps) {
  const [isCompleted, setIsCompleted] = useState(() => exercise.completed || false)

  useEffect(() => {
    setIsCompleted(exercise.completed || false)
  }, [exercise.completed])

  const { mutate: completeExerciseMutation, isPending: loadingExercise } = useCompleteExerciseMutation()

  const canMarkComplete = isDayTodayOrPast(dayOfWeek)

  const toggleExerciseCompletion = () => {
    if (!canMarkComplete) return

    const newCompletedState = !isCompleted
    setIsCompleted(newCompletedState)

    if (onExerciseToggle) {
      onExerciseToggle(exercise.id, newCompletedState)
    }

    completeExerciseMutation({
      exerciseId: exercise.id,
      routineId,
      facilityId,
      completed: newCompletedState,
    })
  }

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
          <div className="flex justify-between items-start mb-2">
            {exerciseNumber !== undefined && (
              <Badge
                variant="outline"
                className="text-xs font-medium"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                Ejercicio N°{exerciseNumber}
              </Badge>
            )}
            {canMarkComplete && (
              <Badge
                variant={isCompleted ? "default" : "outline"}
                className="text-xs font-medium"
                style={{
                  backgroundColor: isCompleted ? primaryColor : "transparent",
                  borderColor: primaryColor,
                  color: isCompleted ? "white" : primaryColor,
                }}
              >
                {isCompleted ? "Completado" : "Pendiente"}
              </Badge>
            )}
          </div>
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
      {canMarkComplete && (
        <CardFooter className="px-3 py-2 border-t">
          <div className="flex items-center gap-2">
            <Checkbox
              id={`complete-${exercise.id}`}
              checked={isCompleted}
              onCheckedChange={toggleExerciseCompletion}
              disabled={loadingExercise}
              className={`bg-[${primaryColor}] border-[${primaryColor}]`}
              style={{
                borderColor: isCompleted ? primaryColor : undefined,
                backgroundColor: isCompleted ? primaryColor : undefined,
              }}
            />
            <div className="flex items-center gap-2">
              {loadingExercise && <Loader2 className="h-3 w-3 animate-spin" style={{ color: primaryColor }} />}
              <label
                htmlFor={`complete-${exercise.id}`}
                className={`text-sm cursor-pointer ${loadingExercise ? "text-muted-foreground" : ""}`}
              >
                Marcar como completado
              </label>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

