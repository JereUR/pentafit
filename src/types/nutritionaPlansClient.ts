import type { MealType } from "@prisma/client"

export interface FoodItemData {
  id: string
  name: string
  portion: number
  unit: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  notes?: string
}

export interface MealData {
  id: string
  mealType: MealType
  time: string | null
  foodItems: FoodItemData[]
  completed?: boolean
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

export interface TodayNutritionalPlanData {
  id: string
  name: string
  description?: string
  meals: MealData[]
  completedMeals?: string[]
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

export function sortMealsByType(meals: MealData[]): MealData[] {
  const mealOrder: Record<string, number> = {
    BREAKFAST: 1,
    PRE_WORKOUT: 2,
    LUNCH: 3,
    SNACK: 4,
    POST_WORKOUT: 5,
    DINNER: 6,
    OTHER: 7,
  }

  return [...meals].sort((a, b) => {
    return mealOrder[a.mealType as string] - mealOrder[b.mealType as string]
  })
}

export interface MealCompletionData {
  id?: string
  mealId?: string
  userId?: string
  facilityId?: string
  completed?: boolean
  date?: string | Date
  value?: number
  updatedAt?: string | Date
  createdAt?: string | Date
}

export interface MealCompletionResult {
  success: boolean
  data?: MealCompletionData
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
