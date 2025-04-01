"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Dumbbell } from "lucide-react"
import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { ExerciseData } from "@/types/routine"
import noImage from "@/assets/no-image.png"

interface ExerciseListProps {
  exercises: ExerciseData[]
  primaryColor: string
}

export function ExerciseList({ exercises, primaryColor }: ExerciseListProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

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

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden relative">
        <CardContent className="p-0">
          <div className="flex items-start gap-3 p-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <Dumbbell className="h-5 w-5" style={{ color: primaryColor }} />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{currentExercise.name}</h4>
                <Badge variant="outline">{currentExercise.bodyZone}</Badge>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
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
                <p className="text-sm text-muted-foreground">{currentExercise.description}</p>
              )}
            </div>
          </div>
          {currentExercise.photoUrl && (
            <div className="h-40 w-full mb-2 bg-card/50">
              <Image
                src={currentExercise.photoUrl || noImage}
                alt={currentExercise.name}
                height={80}
                width={80}
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
        <CardFooter className='flex flex-col items-center gap-2'>
          <div className="flex justify-center gap-1.5 pt-2">
            {exercises.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${index === currentIndex ? "bg-primary w-4" : "bg-muted hover:bg-primary/50"
                  }`}
                style={index === currentIndex ? { backgroundColor: primaryColor } : undefined}
                onClick={() => goToIndex(index)}
                aria-label={`Ir al ejercicio ${index + 1}`}
              />
            ))}
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Ejercicio {currentIndex + 1} de {exercises.length}
          </div>
        </CardFooter>
      </Card>

    </div>
  )
}

