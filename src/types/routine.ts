import { DayOfWeek } from "@prisma/client"

export const columnsRoutines: { key: keyof RoutineData; label: string }[] = [
  { key: "name", label: "Nombre" },
  { key: "description", label: "Descripción" },
  { key: "exercises", label: "Ejercicios asociados" },
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
  routineId?: string | null
  presetRoutineId?: string | null
  createdAt?: Date
  updatedAt?: Date
}

export interface RoutineData {
  id: string
  name: string
  description: string | null
  facilityId: string
  exercises: ExerciseData[]
  createdAt: Date
  updatedAt: Date
}

export interface RoutineDataExport {
  name: string
  description: string
  exercises: string
}

export interface PresetRoutineData {
  id: string
  name: string
  description: string | null
  facilityId: string
  isPublic: boolean
  exercises: ExerciseData[]
  createdAt: Date
  updatedAt: Date
}

export interface UserRoutineData {
  id: string
  userId: string
  routineId: string
  dayOfWeek: DayOfWeek
  isActive: boolean
  routine: RoutineData
  createdAt: Date
  updatedAt: Date
}

export default function formatExercisesToString(
  exercises: ExerciseData[],
): string {
  if (!exercises.length) return "No exercises"

  return exercises
    .map((exercise, index) => {
      return `${index + 1}• ${exercise.name} - ${exercise.bodyZone} - ${exercise.series} series x ${exercise.count} ${exercise.measure}${exercise.rest ? ` - Descanso: ${exercise.rest}s` : ""}${exercise.description ? ` - ${exercise.description}` : ""}.`
    })
    .join("\n")
}
