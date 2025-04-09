"use client"

import { Clock } from "lucide-react"

import { getCurrentDayOfWeek, DAY_DISPLAY_NAMES } from "@/lib/utils"
import { useTodayClientData } from "@/hooks/useTodayClientData"
import { Skeleton } from "../../ui/skeleton"
import EmptyState from "@/components/EmptyState"

interface TodayDiaryProps {
  facilityId: string
  primaryColor: string
}

export function TodayDiary({ facilityId, primaryColor }: TodayDiaryProps) {
  const { diaryData, isLoading, error } = useTodayClientData(facilityId)
  const today = getCurrentDayOfWeek()
  const dayName = DAY_DISPLAY_NAMES[today]
  const colorStyle = primaryColor ? { backgroundColor: `${primaryColor}20` } : {}

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
        href="/mi-agenda"
      />
    )
  }

  return (
    <div className="space-y-4">
      {diaryData.map((diary) => (
        <div key={diary.id} className="rounded-md border p-3">
          <h3 className="font-medium">{diary.activityName}</h3>
          {diary.activityDescription && <p className="text-sm text-muted-foreground">{diary.activityDescription}</p>}
          <div className="mt-2 space-y-2">
            {diary.schedule.map((schedule) => (
              <div key={schedule.id} className="flex items-center gap-2 text-sm" style={{ color: primaryColor }}>
                <Clock className="h-4 w-4" />
                <span>
                  {schedule.timeStart} - {schedule.timeEnd}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

