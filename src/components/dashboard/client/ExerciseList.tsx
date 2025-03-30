import { Dumbbell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ExerciseData } from "@/types/routine"
import Image from "next/image"

interface ExerciseListProps {
  exercises: ExerciseData[]
}

export function ExerciseList({ exercises }: ExerciseListProps) {
  return (
    <div className="space-y-3">
      {exercises.map((exercise) => (
        <Card key={exercise.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-start gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{exercise.name}</h4>
                  <Badge variant="outline">{exercise.bodyZone}</Badge>
                </div>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
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
                {exercise.description && <p className="text-sm text-muted-foreground">{exercise.description}</p>}
              </div>
            </div>
            {exercise.photoUrl && (
              <div className="h-40 w-full bg-muted">
                <Image
                  src={exercise.photoUrl || "/placeholder.svg"}
                  alt={exercise.name}
                  height={80}
                  width={80}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

