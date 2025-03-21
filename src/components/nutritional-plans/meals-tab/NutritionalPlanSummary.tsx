"use client"

import type { DailyMealsValues } from "@/lib/validation"
import { daysOfWeekMap } from "@/lib/utils"

interface NutritionalPlanSummaryProps {
  dailyMeals: DailyMealsValues
  totalMeals: number
  totalFoodItems: number
  isMobile: boolean
}

export function NutritionalPlanSummary({
  dailyMeals,
  totalMeals,
  totalFoodItems,
  isMobile,
}: NutritionalPlanSummaryProps) {
  return (
    <div className="mt-4 p-4 bg-muted rounded-lg">
      <h3 className="font-medium">Resumen del plan nutricional</h3>
      <div className={`grid ${isMobile ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-7"} gap-2 mt-2`}>
        {daysOfWeekMap.map((day) => (
          <div key={day.value} className="text-center">
            <div className="font-medium">{day.label}</div>
            <div
              className={`text-lg ${dailyMeals[day.value as keyof DailyMealsValues].length > 0 ? "text-primary" : "text-muted-foreground"}`}
            >
              {dailyMeals[day.value as keyof DailyMealsValues].length}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-muted-foreground text-center">
        Total: {totalMeals} comidas, {totalFoodItems} alimentos
      </div>
    </div>
  )
}

