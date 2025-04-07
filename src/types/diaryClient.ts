export interface FilteredDayAvailable {
  id?: string
  available: boolean
  timeStart: string
  timeEnd: string
}

export interface DayAvailable {
  id?: string
  available: boolean
  timeStart: string
  timeEnd: string
}

export interface DayWithInfo {
  id: string
  timeStart: string
  timeEnd: string
  dayName: string
}

export interface CalendarEvent {
  id: string
  title: string
  time: string
  diaryName: string
  activityName: string
}

export interface DayEvents {
  date: Date
  dayName: string
  dayNumber: number
  events: CalendarEvent[]
}

export interface DiarySchedule {
  id: string
  timeStart: string
  timeEnd: string
}

export interface TodayDiaryItem {
  id: string
  diaryPlanId: string
  activityName: string
  activityDescription: string | null
  planName: string
  schedule: DiarySchedule[]
}

export type TodayDiaryData = TodayDiaryItem[] | null
