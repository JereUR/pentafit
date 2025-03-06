import { DayOfWeek } from "@prisma/client"

export type ExerciseData = {
  id: string
  name: string
  bodyZone: string
  series: number
  count: number
  measure: string
  rest: number | null
  description: string | null
  photoUrl: string | null
  routineId: string | null
  presetRoutineId: string | null
  createdAt: Date
  updatedAt: Date
}

export type RoutineData = {
  id: string
  name: string
  description: string | null
  facilityId: string
  isActive: boolean
  exercises: ExerciseData[]
  createdAt: Date
  updatedAt: Date
}

export type PresetRoutineData = {
  id: string
  name: string
  description: string | null
  facilityId: string
  isPublic: boolean
  exercises: ExerciseData[]
  createdAt: Date
  updatedAt: Date
}

export type UserRoutineData = {
  id: string
  userId: string
  routineId: string
  dayOfWeek: DayOfWeek
  isActive: boolean
  routine: RoutineData
  createdAt: Date
  updatedAt: Date
}
