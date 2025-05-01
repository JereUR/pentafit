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
          <h3 className="font-medium">{diary.activityName}</h3>
          {diary.activityDescription && (
            <p className="text-sm text-muted-foreground">{diary.activityDescription}</p>
          )}

          <div className="mt-4 space-y-3">
            {diary.schedule.map((schedule) => {
              const key = `${diary.id}-${schedule.id}`
              const isAttended = localAttendances[key] ?? schedule.attended
              const isProcessingAttendance = isPending && localAttendances[key] === true
              const isProcessingAbsence = isPending && localAttendances[key] === false

              return (
                <div key={schedule.id} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm" style={{ color: primaryColor }}>
                    <Clock className="h-4 w-4" />
                    <span>
                      {schedule.timeStart} - {schedule.timeEnd}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <LoadingButton
                      size="sm"
                      loading={isProcessingAttendance}
                      variant={isAttended ? "default" : "outline"}
                      style={{
                        backgroundColor: isAttended ? primaryColor : undefined,
                        borderColor: primaryColor,
                      }}
                      onClick={() => handleAttendance(diary.id, diary.userDiaryId, schedule.id, true)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Asistí
                    </LoadingButton>

                    <LoadingButton
                      size="sm"
                      loading={isProcessingAbsence}
                      variant={!isAttended && localAttendances[key] !== undefined ? "default" : "outline"}
                      style={{
                        backgroundColor: !isAttended && localAttendances[key] === false ? "#ef4444" : undefined,
                        borderColor: "#ef4444",
                        color: !isAttended && localAttendances[key] === false ? "white" : "#ef4444",
                      }}
                      onClick={() => handleAttendance(diary.id, diary.userDiaryId, schedule.id, false)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      No asistí
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