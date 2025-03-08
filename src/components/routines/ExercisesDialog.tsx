"use client"

import Image from "next/image"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ExerciseData } from "@/types/routine"

interface ExercisesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  exercises: ExerciseData[]
  routineName: string
}

export function ExercisesDialog({ open, onOpenChange, exercises, routineName }: ExercisesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle>Ejercicios de {routineName}</DialogTitle>
          <DialogDescription>
            Esta rutina tiene {exercises.length} ejercicio{exercises.length !== 1 ? "s" : ""} asociado
            {exercises.length !== 1 ? "s" : ""}.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[50vh] pr-4">
          <div className="space-y-4">
            {exercises.map((exercise) => (
              <Card key={exercise.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{exercise.name}</CardTitle>
                    <Badge variant="outline">{exercise.bodyZone}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-1">
                        <span className="text-sm font-medium">Series:</span>
                        <span className="text-sm">{exercise.series}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <span className="text-sm font-medium">Repeticiones:</span>
                        <span className="text-sm">
                          {exercise.count} {exercise.measure}
                        </span>
                      </div>
                      {exercise.rest && (
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-sm font-medium">Descanso:</span>
                          <span className="text-sm">{exercise.rest} segundos</span>
                        </div>
                      )}
                      {exercise.description && (
                        <div className="col-span-2 mt-2">
                          <span className="text-sm font-medium">Descripción:</span>
                          <p className="text-sm mt-1">{exercise.description}</p>
                        </div>
                      )}
                    </div>

                    {exercise.photoUrl && (
                      <div className="flex justify-center items-center">
                        <div className="relative h-32 w-32 overflow-hidden rounded-md">
                          <Image
                            src={exercise.photoUrl || "/placeholder.svg"}
                            alt={`Imagen de ${exercise.name}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 128px"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

