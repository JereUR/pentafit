'use client'

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
      const daysToUse = userDiary.selectedDays && userDiary.selectedDays.length > 0 
        ? userDiary.selectedDays 
        : userDiary.diary.daysAvailable.filter(d => d.available)

      daysToUse.forEach((day) => {
        const dayAvailable = userDiary.diary.daysAvailable.find(d => d.id === day.id)
        
        if (dayAvailable) {
          const attended = 'attended' in day ? day.attended : false
          
          const event: CalendarEvent = {
            id: `${userDiary.id}-${dayAvailable.id}`,
            title: userDiary.diary.activity.name,
            time: `${dayAvailable.timeStart} - ${dayAvailable.timeEnd}`,
            diaryName: userDiary.diary.name,
            activityName: userDiary.diary.activity.name,
            diaryId: userDiary.diary.id,
            userDiaryId: userDiary.id,
            dayAvailableId: dayAvailable.id,
            attended
          }

          const targetDay = daysWithEvents.find(
            (d) => d.date.getDay() === dayAvailable.dayOfWeek
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