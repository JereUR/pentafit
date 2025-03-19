import { DayOfWeek } from "@prisma/client"

export type NutritionalPlanData = {
  id: string
  name: string
  description: string | null
  facilityId: string
  dailyMeals: {
    id: string
    dayOfWeek: DayOfWeek
    meals: {
      id: string
      name: string
      mealType: string
      time: string | null
      foodItems: {
        id: string
        name: string
        portion: number
        unit: string
        calories: number | null
        protein: number | null
        carbs: number | null
        fat: number | null
        notes: string | null
      }[]
    }[]
  }[]
  createdAt: Date
  updatedAt: Date
}
