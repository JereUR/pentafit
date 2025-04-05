"use client"

import { useState, useEffect } from "react"
import { Calendar, ChevronDown, ChevronUp, Clock, Users, CheckCircle } from "lucide-react"
import type { DiaryPlanData, SimpleDiaryData } from "@/types/user"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { daysOfWeekFull } from "@/lib/utils"
import { useSubscribeToDiaryMutation } from "@/app/(main)/(authenticated)/(client)/[facilityId]/mi-agenda/mutations"
import { DiaryDaySelector } from "./DiaryDaySelector"
import type { FilteredDayAvailable } from "@/types/diaryClient"
import LoadingButton from "../LoadingButton"
import { useUserDiaries } from "@/hooks/useUserDiaries"

interface DiaryPlanCardProps {
  diaryPlan: DiaryPlanData
  facilityId: string
  primaryColor: string
}

export function DiaryPlanCard({ diaryPlan, facilityId, primaryColor }: DiaryPlanCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedDiaryId, setSelectedDiaryId] = useState<string | null>(null)
  const { mutate: subscribeToDiary, isPending } = useSubscribeToDiaryMutation()
  const [actualAvailableDays, setActualAvailableDays] = useState<string[]>([])

  const { data: userDiariesData } = useUserDiaries(facilityId)

  const isSubscribed = userDiariesData?.userDiaries?.some((userDiary) => userDiary.diaryId === diaryPlan.id)

  useEffect(() => {
    if (diaryPlan.diaries.length > 0) {
      const availableDayIndices = new Set<number>()

      diaryPlan.diaries.forEach((diary) => {
        diary.daysAvailable.forEach((day, index) => {
          if (day.available && index < diaryPlan.daysOfWeek.length && diaryPlan.daysOfWeek[index]) {
            availableDayIndices.add(index)
          }
        })
      })

      const daysWithSchedules = Array.from(availableDayIndices)
        .map((index) => daysOfWeekFull[index])
        .filter(Boolean)

      setActualAvailableDays(daysWithSchedules)
    }
  }, [diaryPlan])

  const handleSubscribeClick = (diaryId: string) => {
    setSelectedDiaryId(diaryId)
  }

  const handleSubscribe = (diaryId: string, selectedDayIds: string[]) => {
    subscribeToDiary(
      {
        diaryId,
        facilityId,
        selectedDayIds,
      },
      {
        onSuccess: () => {
          toast({
            title: "Inscripción exitosa",
            description: "Te has inscrito correctamente a la actividad",
          })
          setSelectedDiaryId(null)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "No se pudo completar la inscripción",
            variant: "destructive",
          })
        },
      },
    )
  }

  const getFilteredDaysAvailable = (
    diary: SimpleDiaryData | undefined,
  ): Array<FilteredDayAvailable & { dayOfWeek: number }> => {
    if (!diary) return []

    return diary.daysAvailable.map((day, index) => {
      return {
        ...day,
        available: day.available && (index < diaryPlan.daysOfWeek.length ? diaryPlan.daysOfWeek[index] : false),
        dayOfWeek: index,
      }
    })
  }

  const getSelectedDiary = (): SimpleDiaryData | undefined => {
    return diaryPlan.diaries.find((diary) => diary.id === selectedDiaryId)
  }

  return (
    <>
      <Card
        className={`overflow-hidden ${isSubscribed ? "border-2" : ""}`}
        style={isSubscribed ? { borderColor: primaryColor } : {}}
      >
        <CardHeader className="pb-2 px-3 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-md"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: primaryColor }} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm sm:text-base truncate">{diaryPlan.name}</CardTitle>
                  {isSubscribed && (
                    <Badge
                      className="text-[8px] sm:text-[10px] flex-shrink-0 ml-1"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <CheckCircle className="h-2.5 w-2.5 mr-1" />
                      Inscrito
                    </Badge>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{diaryPlan.activity.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Badge variant="outline" className="text-[10px] sm:text-xs flex-shrink-0">
                {diaryPlan.sessionsPerWeek} sesiones/semana
              </Badge>
              <Badge
                variant={diaryPlan.vacancies < 5 ? "destructive" : "secondary"}
                className="text-[10px] sm:text-xs flex-shrink-0"
              >
                {diaryPlan.vacancies} {diaryPlan.vacancies === 1 ? "cupo" : "cupos"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2 px-3 sm:px-6">
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
            {actualAvailableDays.map((day) => (
              <Badge key={day} variant="secondary" className="text-[10px] sm:text-xs">
                {day}
              </Badge>
            ))}
          </div>
          {diaryPlan.activity.description && (
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{diaryPlan.activity.description}</p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col items-stretch pt-0 px-3 sm:px-6">
          <Button
            variant="ghost"
            className="flex items-center justify-center gap-1 w-full text-xs sm:text-sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <span>Ocultar horarios</span>
                <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
              </>
            ) : (
              <>
                <span>Ver horarios disponibles</span>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
              </>
            )}
          </Button>

          {isExpanded && diaryPlan.diaries.length > 0 && (
            <div className="mt-2 space-y-3">
              <Separator />
              {diaryPlan.diaries.map((diary) => {
                const filteredDaysAvailable = getFilteredDaysAvailable(diary)
                const hasAvailableDays = filteredDaysAvailable.some((day) => day.available)

                if (!hasAvailableDays) return null

                return (
                  <div key={diary.id} className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <h4 className="font-medium text-xs sm:text-sm truncate">{diary.name}</h4>
                        {diary.genreExclusive !== "NO" && (
                          <Badge variant="outline" className="text-[8px] sm:text-[10px] flex-shrink-0">
                            {diary.genreExclusive === "MASCULINO" ? "Solo hombres" : "Solo mujeres"}
                          </Badge>
                        )}
                      </div>
                      <LoadingButton
                        size="sm"
                        onClick={() => handleSubscribeClick(diary.id)}
                        disabled={isPending || isSubscribed}
                        loading={isPending && selectedDiaryId === diary.id}
                        style={{ backgroundColor: isSubscribed ? "#9CA3AF" : primaryColor }}
                        className="text-[10px] sm:text-xs h-6 sm:h-8 px-2 sm:px-3 ml-2 flex-shrink-0"
                      >
                        {isSubscribed ? "Inscrito" : "Inscribirse"}
                      </LoadingButton>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-xs">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground truncate">{diary.amountOfPeople} personas</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground truncate">{diary.termDuration} minutos</span>
                      </div>
                    </div>

                    <div className="mt-2 space-y-1">
                      <p className="text-[10px] sm:text-xs font-medium">Horarios disponibles:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                        {filteredDaysAvailable
                          .filter((day) => day.available)
                          .map((day) => (
                            <div
                              key={day.id || `day-${day.dayOfWeek}`}
                              className="text-[9px] sm:text-xs p-1 border rounded truncate"
                            >
                              {daysOfWeekFull[day.dayOfWeek]}: {day.timeStart} - {day.timeEnd}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {isExpanded &&
            (diaryPlan.diaries.length === 0 ||
              !diaryPlan.diaries.some((diary) => getFilteredDaysAvailable(diary).some((day) => day.available))) && (
              <div className="mt-4 text-center text-xs sm:text-sm text-muted-foreground">
                No hay horarios disponibles para esta actividad
              </div>
            )}
        </CardFooter>
      </Card>

      {selectedDiaryId && (
        <DiaryDaySelector
          diaryId={selectedDiaryId}
          diaryName={getSelectedDiary()?.name || ""}
          daysAvailable={getSelectedDiary()?.daysAvailable || []}
          diaryPlanDaysOfWeek={diaryPlan.daysOfWeek}
          sessionsPerWeek={diaryPlan.sessionsPerWeek}
          onSubscribe={handleSubscribe}
          isOpen={!!selectedDiaryId}
          onClose={() => setSelectedDiaryId(null)}
          isPending={isPending}
          primaryColor={primaryColor}
        />
      )}
    </>
  )
}

