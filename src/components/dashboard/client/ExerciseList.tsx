"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Dumbbell } from "lucide-react"
import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { ExerciseData } from "@/types/routine"
import noImage from "@/assets/no-image.png"
import { useCompleteExerciseMutation } from "@/app/(main)/(authenticated)/(client)/[facilityId]/mi-progreso/mutations"

interface ExerciseListProps {
  exercises: ExerciseData[]
  primaryColor: string
  routineId: string
  facilityId: string
}

export function ExerciseList({ exercises, primaryColor, routineId, facilityId }: ExerciseListProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completedExercises, setCompletedExercises] = useState<string[]>([])
  const completeExerciseMutation = useCompleteExerciseMutation()

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
    const isCompleted = completedExercises.includes(exerciseId)

    setCompletedExercises((prev) => {
      if (isCompleted) {
        return prev.filter((id) => id !== exerciseId)
      } else {
        return [...prev, exerciseId]
      }
    })

    completeExerciseMutation.mutate({
      exerciseId,
      routineId,
      facilityId,
      completed: !isCompleted,
    })
  }

  const isExerciseCompleted = (exerciseId: string) => {
    return completedExercises.includes(exerciseId)
  }

  return (
    <div className="space-y-4">
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
              style={{
                borderColor: isExerciseCompleted(currentExercise.id) ? primaryColor : undefined,
                backgroundColor: isExerciseCompleted(currentExercise.id) ? primaryColor : undefined,
              }}
            />
            <label htmlFor={`complete-${currentExercise.id}`} className="text-sm cursor-pointer">
              Marcar como completado
            </label>
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
              />
            ))}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
