export interface UserMeasurement {
  id: string
  userId: string
  facilityId: string
  date: Date
  weight: number | null
  height: number | null
  bodyFat: number | null
  muscle: number | null
  chest: number | null
  waist: number | null
  hips: number | null
  arms: number | null
  thighs: number | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ProgressDataPoint {
  date: Date
  value: number
}

export interface ProgressData {
  routine: number
  nutrition: number
  classes: number
  overall: number
  lastUpdated: string
  measurements: UserMeasurement | null
  historical: Record<string, ProgressDataPoint[]>
}

export type ProgressType =
  | "EXERCISE_COMPLETION"
  | "NUTRITION_ADHERENCE"
  | "CLASS_ATTENDANCE"
  | "WEIGHT_TRACKING"
  | "MEASUREMENT"
