import { MealType } from "@prisma/client"

export type FoodItemData = {
  id: string
  name: string
  portion: number
  unit: string
  calories: number | null
  protein: number | null
  carbs: number | null
  fat: number | null
  notes: string | null
  completed: boolean
}

export type MealData = {
  id: string
  mealType: MealType
  time: string | null
  foodItems: FoodItemData[]
  completed: boolean
}

export type TodayNutritionalPlanData = {
  id: string
  name: string
  description: string | null
  meals: MealData[]
  completedMeals: string[]
}

export interface DailyMealData {
  dayOfWeek: string
  meals: MealData[]
}

export interface NutritionalPlanData {
  id: string
  name: string
  description?: string
  dailyMeals: DailyMealData[]
  completedMeals?: string[]
}

export interface MealCompletionResult {
  success: boolean
  userId?: string
  error?: string
}

export interface CompleteMealParams {
  mealId: string
  nutritionalPlanId: string
  facilityId: string
  completed: boolean
}

export interface CompleteAllMealsParams {
  mealIds: string[]
  nutritionalPlanId: string
  facilityId: string
  completed: boolean
}

export interface FoodItemCompletionResult {
  success: boolean
  userId?: string
  error?: string
}

export const mealTypes = [
  { value: "BREAKFAST", label: "Desayuno" },
  { value: "PRE_WORKOUT", label: "Pre-Entrenamiento" },
  { value: "LUNCH", label: "Almuerzo" },
  { value: "SNACK", label: "Merienda" },
  { value: "DINNER", label: "Cena" },
  { value: "POST_WORKOUT", label: "Post-Entrenamiento" },
  { value: "OTHER", label: "Otro" },
]

export const mealTypeNames: Record<MealType, string> = {
  BREAKFAST: "Desayuno",
  PRE_WORKOUT: "Pre-Entrenamiento",
  LUNCH: "Almuerzo",
  SNACK: "Merienda",
  DINNER: "Cena",
  POST_WORKOUT: "Post-Entrenamiento",
  OTHER: "Otro",
}

export function sortMealsByType(meals: MealData[]): MealData[] {
  const mealOrder: Record<MealType, number> = {
    BREAKFAST: 1,
    PRE_WORKOUT: 2,
    LUNCH: 3,
    SNACK: 4,
    POST_WORKOUT: 5,
    DINNER: 6,
    OTHER: 7,
  }

  return [...meals].sort((a, b) => {
    return mealOrder[a.mealType] - mealOrder[b.mealType]
  })
}
