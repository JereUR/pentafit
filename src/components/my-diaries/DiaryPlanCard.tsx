"use client"

import { useState } from "react"
import { Calendar, ChevronDown, ChevronUp, Clock, Users } from 'lucide-react'
import { DiaryPlanData } from "@/types/user"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { daysOfWeekFull } from "@/lib/utils"
import { useSubscribeToDiaryMutation } from "@/app/(main)/(authenticated)/(client)/[facilityId]/mi-agenda/mutations"

interface DiaryPlanCardProps {
  diaryPlan: DiaryPlanData
  facilityId: string
  primaryColor: string
}

export function DiaryPlanCard({ diaryPlan, facilityId, primaryColor }: DiaryPlanCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { mutate: subscribeToDiary, isPending } = useSubscribeToDiaryMutation()

  const handleSubscribe = (diaryId: string) => {
    subscribeToDiary(
      { diaryId, facilityId },
      {
        onSuccess: () => {
          toast({
            title: "Inscripción exitosa",
            description: "Te has inscrito correctamente a la actividad",
          })
        },
        onError: () => {
          toast({
            title: "Error",
            description: "No se pudo completar la inscripción",
            variant: "destructive",
          })
        },
      }
    )
  }

  const availableDays = diaryPlan.daysOfWeek
    .map((isAvailable, index) => (isAvailable ? daysOfWeekFull[index] : null))
    .filter(Boolean)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <Calendar className="h-5 w-5" style={{ color: primaryColor }} />
            </div>
            <div>
              <CardTitle>{diaryPlan.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{diaryPlan.activity.name}</p>
            </div>
          </div>
          <Badge variant="outline">{diaryPlan.sessionsPerWeek} sesiones/semana</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 mb-2">
          {availableDays.map((day) => (
            <Badge key={day} variant="secondary">{day}</Badge>
          ))}
        </div>
        {diaryPlan.activity.description && (
          <p className="text-sm text-muted-foreground">{diaryPlan.activity.description}</p>
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-stretch pt-0">
        <Button
          variant="ghost"
          className="flex items-center justify-center gap-1 w-full"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <span>Ocultar horarios</span>
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              <span>Ver horarios disponibles</span>
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>

        {isExpanded && diaryPlan.diaries.length > 0 && (
          <div className="mt-2 space-y-3">
            <Separator />
            {diaryPlan.diaries.map((diary) => (
              <div key={diary.id} className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{diary.name}</h4>
                    {diary.genreExclusive !== "NO" && (
                      <Badge variant="outline">
                        {diary.genreExclusive === "MASCULINO" ? "Solo hombres" : "Solo mujeres"}
                      </Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleSubscribe(diary.id)}
                    disabled={isPending}
                    style={{ backgroundColor: primaryColor }}
                  >
                    Inscribirse
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">{diary.amountOfPeople} personas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">{diary.termDuration} minutos</span>
                  </div>
                </div>

                <div className="mt-2 space-y-1">
                  <p className="text-xs font-medium">Horarios disponibles:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {diary.daysAvailable.map((day) => (
                      day.available && (
                        <div key={day.id} className="text-xs p-1 border rounded">
                          {day.timeStart} - {day.timeEnd}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isExpanded && diaryPlan.diaries.length === 0 && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            No hay horarios disponibles para esta actividad
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
