import type { DayOfWeek } from "@prisma/client"
import { UserClient } from "./user"
import { daysOfWeekMap } from "@/lib/utils"

export const columnsRoutines: {
  key: keyof RoutineData | keyof RoutineDataExport
  label: string
}[] = [
  { key: "name", label: "Nombre" },
  { key: "description", label: "Descripción" },
  { key: "exercises", label: "Ejercicios asociados" },
  { key: "assignedUsersCount", label: "Usuarios Asignados" },
]

export interface ExerciseData {
  id: string
  name: string
  bodyZone: string
  series: number
  count: number
  measure: string
  rest: number | null
  description: string | null
  photoUrl: string | null
  dailyExerciseId?: string | null
  presetRoutineId?: string | null
  createdAt?: Date
  updatedAt?: Date
}

export interface DailyExerciseData {
  id: string
  dayOfWeek: DayOfWeek
  routineId?: string | null
  presetRoutineId?: string | null
  exercises: ExerciseData[]
  createdAt?: Date
  updatedAt?: Date
}

export interface RoutineData {
  id: string
  name: string
  description: string | null
  facilityId: string
  dailyExercises: DailyExerciseData[]
  assignedUsers?: UserClient[]
  assignedUsersCount?: number
  exercises?: string
  createdAt: Date
  updatedAt: Date
}

export interface RoutineDataExport {
  name: string
  description: string
  exercises: string
}

export default function formatExercisesToString(
  dailyExercises: DailyExerciseData[],
): string {
  if (!dailyExercises || !dailyExercises.length) return "No exercises"

  return dailyExercises
    .map((dailyExercise) => {
      const dayLabel =
        daysOfWeekMap.find((day) => day.value === dailyExercise.dayOfWeek)
          ?.label || dailyExercise.dayOfWeek

      const exercisesText = dailyExercise.exercises.length
        ? dailyExercise.exercises
            .map((exercise, index) => {
              return `  ${index + 1}• ${exercise.name} - ${exercise.bodyZone} - ${exercise.series} series x ${exercise.count} ${exercise.measure}${exercise.rest ? ` - Descanso: ${exercise.rest}s` : ""}${exercise.description ? ` - ${exercise.description}` : ""}.`
            })
            .join("\n")
        : "  No hay ejercicios para este día"

      return `${dayLabel}:\n${exercisesText}`
    })
    .join("\n\n")
}
