"use client"

import { Clock, Utensils } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { FoodItemData } from "@/types/nutritionalPlans"
import type { MealType } from "@prisma/client"
import { mealTypes } from "@/types/nutritionalPlans"

interface MealCardProps {
  mealType: MealType
  time: string | null
  foodItems: FoodItemData[]
  primaryColor: string
  mealNumber?: number
}

function getMealTypeName(mealType: MealType): string {
  const mealTypeObj = mealTypes.find((type) => type.value === mealType)
  return mealTypeObj ? mealTypeObj.label : mealType
}

export function MealCard({ mealType, time, foodItems, primaryColor, mealNumber }: MealCardProps) {
  const mealTypeName = getMealTypeName(mealType)

  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-3">
        {mealNumber !== undefined && (
          <div className="mb-2">
            <Badge
              variant="outline"
              className="text-xs font-medium"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Comida N°{mealNumber}
            </Badge>
          </div>
        )}
        <div className="flex items-start gap-2 mb-3">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <Utensils className="h-4 w-4" style={{ color: primaryColor }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <h4 className="font-medium text-sm">{mealTypeName}</h4>
              {time && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{time}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {foodItems.map((food) => (
            <div key={food.id} className="text-sm">
              <div className="flex justify-between">
                <span className="font-medium">{food.name}</span>
                <span className="text-muted-foreground">
                  {food.portion} {food.unit}
                </span>
              </div>
              {(food.calories || food.protein || food.carbs || food.fat) && (
                <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                  {food.calories && <span>{food.calories} kcal</span>}
                  {food.protein && <span>{food.protein}g prot</span>}
                  {food.carbs && <span>{food.carbs}g carb</span>}
                  {food.fat && <span>{food.fat}g gras</span>}
                </div>
              )}
              {food.notes && <p className="text-xs text-muted-foreground mt-1">{food.notes}</p>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
