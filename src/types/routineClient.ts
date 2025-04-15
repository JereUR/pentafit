export interface ExerciseData {
  id: string
  name: string
  bodyZone: string
  series: number
  count: number
  measure: string
  rest?: number
  description?: string
  photoUrl?: string
  completed?: boolean
}

export interface DailyExerciseData {
  dayOfWeek: string
  exercises: ExerciseData[]
}

export interface RoutineData {
  id: string
  name: string
  description?: string
  dailyExercises: DailyExerciseData[]
  completedExercises: string[]
}

export interface TodayRoutineData {
  id: string
  name: string
  description?: string
  exercises: ExerciseData[]
  completedExercises: string[]
}
