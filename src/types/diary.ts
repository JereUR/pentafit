import { genreExclusive, typeSchedule } from "@prisma/client"

export const columnsDiaries: { key: keyof DiaryData; label: string }[] = [
  { key: "name", label: "Nombre" },
  { key: "typeSchedule", label: "Tipo de agenda" },
  { key: "dateFrom", label: "Fecha desde" },
  { key: "dateUntil", label: "Fecha hasta" },
  { key: "repeatFor", label: "Repetir cada (días)" },
  { key: "offerDays", label: "Días de oferta" },
  { key: "termDuration", label: "Duración" },
  { key: "amountOfPeople", label: "Cantidad de personas por turno" },
  { key: "isActive", label: "Activa" },
  { key: "genreExclusive", label: "Exclusividad de género" },
  { key: "worksHolidays", label: "Trabaja feriados" },
  { key: "observations", label: "Observaciones" },
]

export type DiaryData = {
  id: string
  name: string
  typeSchedule: typeSchedule
  dateFrom: Date
  dateUntil: Date
  repeatFor: number | null
  offerDays: boolean[]
  termDuration: number
  amountOfPeople: number
  isActive: boolean
  genreExclusive: genreExclusive
  worksHolidays: boolean
  observations: string | null
  facilityId: string
}

export type DiaryExportData = {
  name: string
  typeSchedule: string
  DateFrom: string
  DateUntil: string
  repeatFor: string
  offerDays: string
  termDuration: string
  amountOfPeople: string
  isActive: string
  genreExclusive: string
  worksHolidays: string
  observations: string
}

export const hoursOfDays = [
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
  "23:30",
  "00:00",
]
