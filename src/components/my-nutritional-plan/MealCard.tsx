"use client"

import { useState, useEffect } from "react"
import { Clock, Utensils, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { isDayTodayOrPast } from "@/lib/utils"
import {
  useCompleteFoodItemMutation,
  useCompleteMealMutation,
} from "@/app/(main)/(authenticated)/(client)/[facilityId]/mi-plan-nutricional/mutations"
import { CustomCheckbox } from "./CustomCheckbox"
import { MealData, mealTypeNames } from "@/types/nutritionaPlansClient"

interface MealCardProps {
  meal: MealData
  primaryColor: string
  mealNumber?: number
  nutritionalPlanId: string
  facilityId: string
  dayOfWeek: string
  onMealToggle?: (mealId: string, completed: boolean) => void
  onFoodItemToggle?: (foodItemId: string, completed: boolean) => void
}

export function MealCard({
  meal,
  primaryColor,
  mealNumber,
  nutritionalPlanId,
  facilityId,
  dayOfWeek,
  onMealToggle,
  onFoodItemToggle,
}: MealCardProps) {
  const [isCompleted, setIsCompleted] = useState(() => Boolean(meal.completed))
  const [completedFoodItems, setCompletedFoodItems] = useState<string[]>(
    meal.foodItems.filter((food) => food.completed).map((food) => food.id),
  )

  const { mutate: completeMealMutation, isPending: loadingMeal } = useCompleteMealMutation()
  const { mutate: completeFoodItemMutation, isPending: loadingFoodItem } = useCompleteFoodItemMutation()

  const canMarkComplete = isDayTodayOrPast(dayOfWeek)

  useEffect(() => {
    setIsCompleted(Boolean(meal.completed))
    setCompletedFoodItems(meal.foodItems.filter((food) => food.completed).map((food) => food.id))
  }, [meal.completed, meal.foodItems])

  const toggleMealCompletion = () => {
    if (!canMarkComplete || loadingMeal) return

    const newCompletedState = !isCompleted

    completeMealMutation({
      mealId: meal.id,
      nutritionalPlanId,
      facilityId,
      completed: newCompletedState,
    })

    setIsCompleted(newCompletedState)
    const newFoodItems = newCompletedState ? meal.foodItems.map((food) => food.id) : []
    setCompletedFoodItems(newFoodItems)

    if (onMealToggle) {
      onMealToggle(meal.id, newCompletedState)
    }

    if (onFoodItemToggle) {
      meal.foodItems.forEach((food) => {
        onFoodItemToggle(food.id, newCompletedState)
      })
    }
  }

  const toggleFoodItemCompletion = (foodItemId: string) => {
    if (!canMarkComplete || loadingFoodItem) return

    const isFoodCompleted = completedFoodItems.includes(foodItemId)

    completeFoodItemMutation({
      foodItemId,
      mealId: meal.id,
      nutritionalPlanId,
      facilityId,
      completed: !isFoodCompleted,
    })

    setCompletedFoodItems((prev) =>
      isFoodCompleted
        ? prev.filter((id) => id !== foodItemId)
        : [...prev, foodItemId],
    )

    if (onFoodItemToggle) {
      onFoodItemToggle(foodItemId, !isFoodCompleted)
    }
  }

  const mealTypeName = mealTypeNames[meal.mealType]

  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-2">
          {mealNumber !== undefined && (
            <Badge
              variant="outline"
              className="text-xs font-medium"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Comida N°{mealNumber}
            </Badge>
          )}
          {canMarkComplete && (
            <Badge
              variant={isCompleted ? "default" : "outline"}
              className="text-xs font-medium"
              style={{
                backgroundColor: isCompleted ? primaryColor : "transparent",
                borderColor: primaryColor,
                color: isCompleted ? "white" : primaryColor,
              }}
            >
              {isCompleted ? "Completada" : "Pendiente"}
            </Badge>
          )}
        </div>
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
              {meal.time && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{meal.time}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {meal.foodItems.map((food, index) => (
            <div key={food.id} className="text-sm">
              {index > 0 && <Separator className="my-2" />}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {canMarkComplete && (
                    <CustomCheckbox
                      id={`food-${food.id}`}
                      checked={completedFoodItems.includes(food.id)}
                      onChange={() => toggleFoodItemCompletion(food.id)}
                      disabled={loadingFoodItem}
                      primaryColor={primaryColor}
                    />
                  )}
                  <label
                    htmlFor={`food-${food.id}`}
                    className={`text-sm ${canMarkComplete ? "cursor-pointer" : ""} ${loadingFoodItem ? "text-muted-foreground" : ""
                      }`}
                  >
                    {food.name}
                  </label>
                </div>
                <span className="text-muted-foreground">
                  {food.portion} {food.unit}
                </span>
              </div>
              {(food.calories || food.protein || food.carbs || food.fat) && (
                <div className="flex gap-2 text-xs text-muted-foreground mt-1 ml-6">
                  {food.calories && <span>{food.calories} kcal</span>}
                  {food.protein && <span>{food.protein}g prot</span>}
                  {food.carbs && <span>{food.carbs}g carb</span>}
                  {food.fat && <span>{food.fat}g gras</span>}
                </div>
              )}
              {food.notes && (
                <p className="text-xs text-muted-foreground mt-1 ml-6">{food.notes}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      {canMarkComplete && (
        <CardFooter className="px-3 py-2 border-t">
          <div className="flex items-center gap-2">
            <CustomCheckbox
              id={`complete-${meal.id}`}
              checked={isCompleted}
              onChange={toggleMealCompletion}
              disabled={loadingMeal}
              primaryColor={primaryColor}
            />
            <div className="flex items-center gap-2">
              {loadingMeal && (
                <Loader2 className="h-3 w-3 animate-spin" style={{ color: primaryColor }} />
              )}
              <label
                htmlFor={`complete-${meal.id}`}
                className={`text-sm cursor-pointer ${loadingMeal ? "text-muted-foreground" : ""}`}
                onClick={toggleMealCompletion}
              >
                Marcar comida completa
              </label>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}