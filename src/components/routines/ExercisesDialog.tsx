import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type DailyExerciseData, daysOfWeek } from "@/types/routine"
import Image from "next/image"
import { useMediaQuery } from "@/hooks/useMediaQuery"

interface ExercisesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dailyExercises: DailyExerciseData[]
  routineName: string
}

export function ExercisesDialog({ open, onOpenChange, dailyExercises, routineName }: ExercisesDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const defaultTab = dailyExercises.length > 0 ? dailyExercises[0].dayOfWeek : "MONDAY"

  const exerciseCounts = dailyExercises.reduce(
    (counts, day) => {
      counts[day.dayOfWeek] = day.exercises.length
      return counts
    },
    {} as Record<string, number>,
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px] max-h-[90vh] max-w-[95vw] rounded-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Ejercicios de {routineName}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue={defaultTab} className="w-full">
          {isMobile ? (
            <ScrollArea className="w-full pb-2">
              <TabsList className="grid w-full grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mb-4 h-fit">
                {daysOfWeek.map((day) => (
                  <TabsTrigger key={day.value} value={day.value} className="text-xs relative">
                    {day.label.substring(0, 3)}
                    {exerciseCounts[day.value] > 0 && (
                      <span className="absolute -top-1 -right-1 bg-foreground text-primary z-50 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {exerciseCounts[day.value]}
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
          ) : (
            <TabsList className="grid grid-cols-7 w-full">
              {daysOfWeek.map((day) => (
                <TabsTrigger key={day.value} value={day.value} className="relative">
                  {day.label}
                  {exerciseCounts[day.value] > 0 && (
                    <span className="absolute -top-1 -right-1 bg-foreground text-primary z-50 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {exerciseCounts[day.value]}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          )}

          {daysOfWeek.map((day) => {
            const dailyExercise = dailyExercises.find((de) => de.dayOfWeek === day.value)
            const exercises = dailyExercise?.exercises || []

            return (
              <TabsContent key={day.value} value={day.value} className="mt-4">
                <ScrollArea className="h-[400px] md:h-[500px] rounded-md border p-4">
                  {exercises.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {exercises.map((exercise) => (
                        <div key={exercise.id} className="border rounded-lg p-4 shadow-sm">
                          <div className="flex flex-col h-full">
                            <div className="flex-1">
                              <h4 className="font-medium text-lg text-primary">{exercise.name}</h4>
                              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                <div>
                                  <span className="font-semibold">Zona: </span>
                                  {exercise.bodyZone}
                                </div>
                                <div>
                                  <span className="font-semibold">Series: </span>
                                  {exercise.series}
                                </div>
                                <div>
                                  <span className="font-semibold">Cantidad: </span>
                                  {exercise.count} {exercise.measure}
                                </div>
                                <div>
                                  <span className="font-semibold">Descanso: </span>
                                  {exercise.rest ? `${exercise.rest}s` : "N/A"}
                                </div>
                              </div>
                              {exercise.description && (
                                <div className="mt-2 text-sm">
                                  <span className="font-semibold">Descripción: </span>
                                  {exercise.description}
                                </div>
                              )}
                            </div>

                            {exercise.photoUrl && (
                              <div className="mt-4 flex justify-center items-center">
                                <div className="relative h-40 w-full overflow-hidden rounded-md bg-muted">
                                  <Image
                                    src={exercise.photoUrl || "/placeholder.svg"}
                                    alt={`Imagen de ${exercise.name}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-contain"
                                    onError={(e) => {
                                      ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=160&width=300"
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-center text-muted-foreground py-8">No hay ejercicios para este día</p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            )
          })}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

