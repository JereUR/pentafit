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
