import type { DayOfWeek, MealType } from "@prisma/client"
import type { UserClient } from "./user"
import { daysOfWeekMap } from "@/lib/utils"

export const columnsNutritionalPlans: {
  key: keyof NutritionalPlanData | keyof NutritionalPlanDataExport
  label: string
}[] = [
  { key: "name", label: "Nombre" },
  { key: "description", label: "Descripción" },
  { key: "meals", label: "Comidas asociadas" },
  { key: "assignedUsersCount", label: "Usuarios Asignados" },
]

export const columnsPresetNutritionalPlans: {
  key: keyof NutritionalPlanData | keyof PresetNutritionalPlanDataExport
  label: string
}[] = [
  { key: "name", label: "Nombre" },
  { key: "description", label: "Descripción" },
  { key: "meals", label: "Comidas asociadas" },
]

export const mealTypes = [
  { value: "BREAKFAST", label: "Desayuno" },
  { value: "PRE_WORKOUT", label: "Pre-Entrenamiento" },
  { value: "LUNCH", label: "Almuerzo" },
  { value: "SNACK", label: "Merienda" },
  { value: "DINNER", label: "Cena" },
  { value: "POST_WORKOUT", label: "Post-Entrenamiento" },
  { value: "OTHER", label: "Otro" },
]

export interface FoodItemData {
  id: string
  name: string
  portion: number
  unit: string
  calories: number | null
  protein: number | null
  carbs: number | null
  fat: number | null
  notes: string | null
  mealId?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface MealData {
  id: string
  mealType: MealType
  time: string | null
  dailyMealId: string
  foodItems: FoodItemData[]
  createdAt?: Date
  updatedAt?: Date
}

export interface DailyMealData {
  id: string
  dayOfWeek: DayOfWeek
  nutritionalPlanId?: string | null
  presetNutritionalPlanId?: string | null
  meals: MealData[]
  createdAt?: Date
  updatedAt?: Date
}

export interface NutritionalPlanData {
  id: string
  name: string
  description: string | null
  facilityId: string
  dailyMeals: DailyMealData[]
  assignedUsers?: UserClient[]
  assignedUsersCount?: number
  meals?: string
  createdAt: Date
  updatedAt: Date
}

export interface PresetNutritionalPlanDataExport {
  name: string
  description: string
  meals: string
}

export interface NutritionalPlanDataExport
  extends PresetNutritionalPlanDataExport {
  assignedUsersCount: string
}

export default function formatMealsToString(
  dailyMeals: DailyMealData[],
): string {
  if (!dailyMeals || !dailyMeals.length) return "No meals"

  return dailyMeals
    .map((dailyMeal) => {
      const dayLabel =
        daysOfWeekMap.find((day) => day.value === dailyMeal.dayOfWeek)?.label ||
        dailyMeal.dayOfWeek

      const mealsText = dailyMeal.meals.length
        ? dailyMeal.meals
            .map((meal) => {
              const mealTypeLabel =
                mealTypes.find((type) => type.value === meal.mealType)?.label ||
                meal.mealType

              const foodItemsText = meal.foodItems.length
                ? meal.foodItems
                    .map((item, index) => {
                      return `    ${index + 1}• ${item.name} - ${item.portion} ${item.unit}${item.calories ? ` - Calorías: ${item.calories}` : ""}${item.protein ? ` - Proteínas: ${item.protein}g` : ""}${item.carbs ? ` - Carbohidratos: ${item.carbs}g` : ""}${item.fat ? ` - Grasas: ${item.fat}g` : ""}${item.notes ? ` - ${item.notes}` : ""}.`
                    })
                    .join("\n")
                : "    No hay alimentos para esta comida"

              return `  ${mealTypeLabel}${meal.time ? ` (${meal.time})` : ""}: \n${foodItemsText}`
            })
            .join("\n\n")
        : "  No hay comidas para este día"

      return `${dayLabel}:\n${mealsText}`
    })
    .join("\n\n")
}
