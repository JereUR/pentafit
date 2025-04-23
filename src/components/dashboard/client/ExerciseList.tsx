"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Dumbbell, CheckSquare, Loader2 } from "lucide-react"
import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { ExerciseData } from "@/types/routine"
import noImage from "@/assets/no-image.png"
import LoadingButton from "@/components/LoadingButton"
import {
  useCompleteAllExercisesMutation,
  useCompleteExerciseMutation,
} from "@/app/(main)/(authenticated)/(client)/[facilityId]/mi-rutina/mutations"
import { getCurrentDayOfWeek } from "@/lib/utils"
import type { DayOfWeek } from "@prisma/client"

interface ExerciseListProps {
  exercises: ExerciseData[]
  primaryColor: string
  routineId: string
  facilityId: string
  completedExercises: string[]
}

export function ExerciseList({
  exercises,
  primaryColor,
  routineId,
  facilityId,
  completedExercises,
}: ExerciseListProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [localCompletedExercises, setLocalCompletedExercises] = useState<string[]>(completedExercises)
  const [loadingExerciseId, setLoadingExerciseId] = useState<string | null>(null)
  const { mutate: completeExerciseMutation, isPending: isLoadingExercise } = useCompleteExerciseMutation()
  const { mutate: completeAllExercisesMutation, isPending: loadingAllExercise } = useCompleteAllExercisesMutation()

  const today = getCurrentDayOfWeek() as DayOfWeek

  useEffect(() => {
    setLocalCompletedExercises(completedExercises)
  }, [completedExercises])

  useEffect(() => {
    if (!isLoadingExercise) {
      setLoadingExerciseId(null)
    }
  }, [isLoadingExercise])

  if (!exercises.length) {
    return <div className="text-center text-muted-foreground">No hay ejercicios disponibles</div>
  }

  const currentExercise = exercises[currentIndex]

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % exercises.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + exercises.length) % exercises.length)
  }

  const goToIndex = (index: number) => {
    setCurrentIndex(index)
  }

  const toggleExerciseCompletion = (exerciseId: string) => {
    const isCompleted = localCompletedExercises.includes(exerciseId)

    setLocalCompletedExercises((prev) => {
      if (isCompleted) {
        return prev.filter((id) => id !== exerciseId)
      } else {
        return [...prev, exerciseId]
      }
    })
    setLoadingExerciseId(exerciseId)

    completeExerciseMutation({
      exerciseId,
      routineId,
      facilityId,
      completed: !isCompleted,
      dayOfWeek: today, 
    })
  }

  const handleCompleteAll = () => {
    const exerciseIds = exercises.map((exercise) => exercise.id)
    const allCompleted = exerciseIds.every((id) => localCompletedExercises.includes(id))

    const newCompletionState = !allCompleted

    if (newCompletionState) {
      setLocalCompletedExercises(exerciseIds)
    } else {
      setLocalCompletedExercises([])
    }

    completeAllExercisesMutation({
      exerciseIds,
      routineId,
      facilityId,
      completed: newCompletionState,
      dayOfWeek: today, 
    })
  }

  const isExerciseCompleted = (exerciseId: string) => {
    return localCompletedExercises.includes(exerciseId)
  }

  const isExerciseLoading = (exerciseId: string) => {
    return loadingExerciseId === exerciseId || loadingAllExercise
  }

  const areAllExercisesCompleted =
    exercises.length > 0 && exercises.every((exercise) => localCompletedExercises.includes(exercise.id))

  const isLoading = isLoadingExercise || loadingAllExercise

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <LoadingButton
          loading={loadingAllExercise}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleCompleteAll}
          style={{
            borderColor: primaryColor,
            color: areAllExercisesCompleted ? "white" : primaryColor,
            backgroundColor: areAllExercisesCompleted ? primaryColor : "transparent",
          }}
        >
          <CheckSquare className="h-4 w-4" />
          <span>{areAllExercisesCompleted ? "Desmarcar todos" : "Completar todos"}</span>
        </LoadingButton>
      </div>

      <Card className="overflow-hidden relative">
        <CardContent className="p-0">
          <div className="flex items-start gap-2 p-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <Dumbbell className="h-4 w-4" style={{ color: primaryColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <h4 className="font-medium text-sm truncate">{currentExercise.name}</h4>
                <Badge variant="outline" className="text-xs self-start sm:self-auto">
                  {currentExercise.bodyZone}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1 text-xs text-muted-foreground mt-1">
                <span>{currentExercise.series} series</span>
                <span>•</span>
                <span>
                  {currentExercise.count} {currentExercise.measure}
                </span>
                {currentExercise.rest && (
                  <>
                    <span>•</span>
                    <span>{currentExercise.rest}s rest</span>
                  </>
                )}
              </div>
              {currentExercise.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{currentExercise.description}</p>
              )}
            </div>
          </div>
          {currentExercise.photoUrl && (
            <div className="h-40 w-full bg-card/50">
              <Image
                src={currentExercise.photoUrl || noImage}
                alt={currentExercise.name}
                height={160}
                width={320}
                className="h-full w-full object-contain"
              />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 shadow-sm"
            onClick={goToPrevious}
            aria-label="Ejercicio anterior"
            style={{ backgroundColor: `${primaryColor}20` }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${primaryColor}40`)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = `${primaryColor}20`)}
            disabled={isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 shadow-sm"
            onClick={goToNext}
            aria-label="Ejercicio siguiente"
            style={{ backgroundColor: `${primaryColor}20` }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${primaryColor}40`)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = `${primaryColor}20`)}
            disabled={isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardContent>
        <CardFooter className="flex justify-between items-center py-2 px-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id={`complete-${currentExercise.id}`}
              checked={isExerciseCompleted(currentExercise.id)}
              onCheckedChange={() => toggleExerciseCompletion(currentExercise.id)}
              disabled={isExerciseLoading(currentExercise.id)}
              className={`bg-[${primaryColor}] border-[${primaryColor}]`}
              style={{
                borderColor: isExerciseCompleted(currentExercise.id) ? primaryColor : undefined,
                backgroundColor: isExerciseCompleted(currentExercise.id) ? primaryColor : undefined,
              }}
            />
            <div className="flex items-center gap-2">
              {isExerciseLoading(currentExercise.id) && (
                <Loader2 className="h-3 w-3 animate-spin" style={{ color: primaryColor }} />
              )}
              <label
                htmlFor={`complete-${currentExercise.id}`}
                className={`text-sm cursor-pointer ${isExerciseLoading(currentExercise.id) ? "text-muted-foreground" : ""}`}
              >
                Marcar como completado
              </label>
            </div>
          </div>
          <div className="flex justify-center gap-1.5">
            {exercises.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${index === currentIndex ? "w-4" : "w-2 bg-muted hover:bg-primary/50"
                  }`}
                style={index === currentIndex ? { backgroundColor: primaryColor } : undefined}
                onClick={() => goToIndex(index)}
                aria-label={`Ir al ejercicio ${index + 1}`}
                disabled={isLoading}
              />
            ))}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
