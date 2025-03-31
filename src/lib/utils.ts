import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, differenceInYears } from "date-fns"
import { ZodError } from "zod"
import { DayOfWeek, MealType } from "@prisma/client"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatBirthday = (birthday: string) => {
  const date = new Date(birthday)
  const formattedDate = format(date, "dd/MM/yyyy")
  const age = differenceInYears(new Date(), date)
  return `${formattedDate} (${age} años)`
}

export const daysOfWeek = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"]

export const daysOfWeekFull = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
]

export const daysOfWeekMap = [
  { value: "MONDAY", label: "Lunes" },
  { value: "TUESDAY", label: "Martes" },
  { value: "WEDNESDAY", label: "Miércoles" },
  { value: "THURSDAY", label: "Jueves" },
  { value: "FRIDAY", label: "Viernes" },
  { value: "SATURDAY", label: "Sábado" },
  { value: "SUNDAY", label: "Domingo" },
]

export interface SelectOption {
  key: string
  value: string
}

export const mapEnumToValue = <T extends { key: string; value: string }>(
  options: T[],
  key: string,
): string => {
  return options.find((option) => option.key === key)?.value || key
}

export type DeleteEntityResult = {
  success: boolean
  message: string
  deletedCount?: number
}

export function formatZodErrors(error: unknown): Record<string, string> {
  if (!(error instanceof ZodError)) {
    return {}
  }

  const formattedErrors: Record<string, string> = {}

  error.errors.forEach((err) => {
    const path = err.path.join(".")
    formattedErrors[path || err.path[0]?.toString() || "form"] = err.message
  })

  return formattedErrors
}

export function getCurrentDayOfWeek(): DayOfWeek {
  const days = [
    DayOfWeek.SUNDAY,
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
  ]

  const dayIndex = new Date().getDay()
  return days[dayIndex]
}

export const DAY_DISPLAY_NAMES = {
  [DayOfWeek.MONDAY]: "Lunes",
  [DayOfWeek.TUESDAY]: "Martes",
  [DayOfWeek.WEDNESDAY]: "Miércoles",
  [DayOfWeek.THURSDAY]: "Jueves",
  [DayOfWeek.FRIDAY]: "Viernes",
  [DayOfWeek.SATURDAY]: "Sábado",
  [DayOfWeek.SUNDAY]: "Domingo",
}

export const MEAL_TYPE_DISPLAY_NAMES = {
  [MealType.BREAKFAST]: "Desayuno",
  [MealType.PRE_WORKOUT]: "Pre-Entrenamiento",
  [MealType.LUNCH]: "Almuerzo",
  [MealType.SNACK]: "Merienda",
  [MealType.DINNER]: "Cena",
  [MealType.POST_WORKOUT]: "Post-Entrenamiento",
  [MealType.OTHER]: "Otro",
}

export function formatDate(date: Date): string {
  const formattedDate = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
}
