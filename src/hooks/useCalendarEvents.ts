"use client"

import { useMemo } from "react"

import type { UserDiaryData } from "@/types/user"
import type { CalendarEvent, DayEvents } from "@/types/diaryClient"

export function useCalendarEvents(
  userDiaries: UserDiaryData[] | undefined,
  weekDays: DayEvents[],
) {
  return useMemo(() => {
    if (!userDiaries || userDiaries.length === 0) {
      return weekDays
    }

    const daysWithEvents = weekDays.map((day) => ({
      ...day,
      events: [] as CalendarEvent[],
    }))

    userDiaries.forEach((userDiary) => {
      if (!userDiary.selectedDays) return

      userDiary.selectedDays.forEach((day) => {
        const dayOfWeek = userDiary.diary.daysAvailable.findIndex(
          (d) => d.id === day.id,
        )
        if (dayOfWeek >= 0) {
          const event: CalendarEvent = {
            id: `${userDiary.id}-${day.id}`,
            title: userDiary.diary.activity.name,
            time: `${day.timeStart} - ${day.timeEnd}`,
            diaryName: userDiary.diary.name,
            activityName: userDiary.diary.activity.name,
          }

          const targetDay = daysWithEvents.find(
            (d) => d.date.getDay() === dayOfWeek,
          )
          if (targetDay) {
            targetDay.events.push(event)
          }
        }
      })
    })

    return daysWithEvents
  }, [userDiaries, weekDays])
}
