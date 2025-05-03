"use client"

import { Clock, Check, X } from "lucide-react"
import { useState } from "react"

import { getCurrentDayOfWeek, DAY_DISPLAY_NAMES } from "@/lib/utils"
import { useTodayClientData } from "@/hooks/useTodayClientData"
import { Skeleton } from "../../ui/skeleton"
import EmptyState from "@/components/EmptyState"
import type { DayOfWeek } from "@prisma/client"
import { useDiaryAttendanceMutation } from "@/app/(main)/(authenticated)/(client)/[facilityId]/mi-agenda/mutations"
import LoadingButton from "@/components/LoadingButton"
import { Badge } from "@/components/ui/badge"

interface TodayDiaryProps {
  facilityId: string
  primaryColor: string
}

export function TodayDiary({ facilityId, primaryColor }: TodayDiaryProps) {
  const { diaryData, isLoading, error } = useTodayClientData(facilityId)
  const today = getCurrentDayOfWeek()
  const dayName = DAY_DISPLAY_NAMES[today]
  const colorStyle = primaryColor ? { backgroundColor: `${primaryColor}20` } : {}
  const [localAttendances, setLocalAttendances] = useState<Record<string, boolean>>({})
  const { mutate: recordAttendance, isPending } = useDiaryAttendanceMutation()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" style={colorStyle} />
        <Skeleton className="h-20 w-full" style={colorStyle} />
        <Skeleton className="h-4 w-1/2" style={colorStyle} />
      </div>
    )
  }

  if (error) {
    return <div className="p-4 text-sm text-red-500">{error}</div>
  }

  if (!diaryData || diaryData.length === 0) {
    return (
      <EmptyState
        title={`No hay clases para ${dayName}`}
        description="No tienes clases programadas para hoy."
        icon="calendar"
        primaryColor={primaryColor}
        href={`/${facilityId}/mi-agenda`}
      />
    )
  }

  const handleAttendance = (diaryId: string, userDiaryId: string, dayAvailableId: string, attended: boolean) => {
    const key = `${diaryId}-${dayAvailableId}`
    setLocalAttendances(prev => ({ ...prev, [key]: attended }))

    recordAttendance({
      diaryId,
      userDiaryId,
      facilityId,
      attended,
      dayOfWeek: today as DayOfWeek,
      dayAvailableId
    })
  }

  return (
    <div className="space-y-4">
      {diaryData.map((diary) => (
        <div key={diary.id} className="rounded-md border p-3 relative">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{diary.activityName}</h3>
              {diary.activityDescription && (
                <p className="text-sm text-muted-foreground">{diary.activityDescription}</p>
              )}
            </div>
            <Badge
              variant={diary.schedule.some(s => localAttendances[`${diary.id}-${s.id}`] ?? s.attended)
                ? "default"
                : "secondary"
              }
              style={{ backgroundColor: primaryColor }}
              className="ml-2"
            >
              {diary.schedule.some(s => localAttendances[`${diary.id}-${s.id}`] ?? s.attended)
                ? "Asistencia registrada"
                : "Pendiente de asistencia"}
            </Badge>
          </div>

          <div className="mt-4 space-y-3">
            {diary.schedule.map((schedule) => {
              const key = `${diary.id}-${schedule.id}`
              const isAttended = localAttendances[key] ?? schedule.attended
              const isProcessing = isPending && localAttendances[key] !== undefined

              return (
                <div key={schedule.id} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm" style={{ color: primaryColor }}>
                      <Clock className="h-4 w-4" />
                      <span>
                        {schedule.timeStart} - {schedule.timeEnd}
                      </span>
                    </div>
                    <Badge
                      variant={isAttended ? "default" : "outline"}
                      style={{
                        backgroundColor: isAttended ? primaryColor : "transparent",
                        borderColor: isAttended ? primaryColor : "#e2e8f0",
                      }}
                    >
                      {isProcessing ? (
                        "Procesando..."
                      ) : isAttended ? (
                        <span className="flex items-center gap-1">
                          <Check className="h-3 w-3" /> Asistiré
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <X className="h-3 w-3" /> No asistiré
                        </span>
                      )}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <LoadingButton
                      size="sm"
                      loading={isPending && localAttendances[key] === true}
                      variant={isAttended ? "default" : "outline"}
                      style={{
                        backgroundColor: isAttended ? primaryColor : undefined,
                        borderColor: primaryColor,
                      }}
                      onClick={() => handleAttendance(diary.id, diary.userDiaryId, schedule.id, true)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Confirmar
                    </LoadingButton>

                    <LoadingButton
                      size="sm"
                      loading={isPending && localAttendances[key] === false}
                      variant={!isAttended && localAttendances[key] !== undefined ? "default" : "outline"}
                      style={{
                        backgroundColor: !isAttended && localAttendances[key] === false ? "#ef4444" : undefined,
                        borderColor: "#ef4444",
                        color: !isAttended && localAttendances[key] === false ? "white" : "#ef4444",
                      }}
                      onClick={() => handleAttendance(diary.id, diary.userDiaryId, schedule.id, false)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </LoadingButton>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}