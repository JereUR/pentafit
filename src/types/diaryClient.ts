import { DayOfWeek } from "@prisma/client"

export interface FilteredDayAvailable {
  id?: string
  available: boolean
  timeStart: string
  timeEnd: string
}

export interface DayAvailable {
  id: string
  dayOfWeek: number
  available: boolean
  timeStart: string
  timeEnd: string
}

export interface DayWithInfo {
  id: string
  timeStart: string
  timeEnd: string
  dayName: string
  dayOfWeek: number  
  available: boolean
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
  id: string;
  timeStart: string;
  timeEnd: string;
  attended?: boolean;
}

export interface TodayDiaryItem {
  id: string
  diaryPlanId: string
  activityName: string
  activityDescription: string | null
  planName: string
  schedule: DiarySchedule[]
  attended?: boolean
}

export type TodayDiaryData = TodayDiaryItem[] | null

export interface DiaryAttendanceResponse {
  diaryId: string
  attended: boolean
}

export interface TodayDiaryResponseItem {
  id: string;
  userDiaryId: string;
  diaryPlanId: string;
  activityName: string;
  activityDescription: string | null;
  planName: string;
  schedule: DiarySchedule[];
}

export interface TodayDiaryItem extends TodayDiaryResponseItem {
  attended?: boolean
  userDiaryId: string
}

export interface DiaryAttendanceParams {
  diaryId: string
  userDiaryId: string
  facilityId: string
  attended: boolean
  dayOfWeek: DayOfWeek
  dayAvailableId: string
}