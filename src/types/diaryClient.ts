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
