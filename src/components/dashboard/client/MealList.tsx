"use client"

import { useState, useEffect } from "react"
import { Clock, CheckSquare } from 'lucide-react'
import { Loader2 } from 'lucide-react'

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { MEAL_TYPE_DISPLAY_NAMES, getCurrentDayOfWeek } from "@/lib/utils"
import LoadingButton from "@/components/LoadingButton"
import {
  useCompleteFoodItemMutation,
  useCompleteMealMutation,
  useCompleteAllMealsMutation,
} from "@/app/(main)/(authenticated)/(client)/[facilityId]/mi-plan-nutricional/mutations"
import { MealData } from "@/types/nutritionaPlansClient"
import type { DayOfWeek } from "@prisma/client"

interface MealListProps {
  meals: MealData[]
  nutritionalPlanId: string
  facilityId: string
  primaryColor?: string
}

export function MealList({ meals, nutritionalPlanId, facilityId, primaryColor = "#F97015" }: MealListProps) {
  const [localCompletedFoodItems, setLocalCompletedFoodItems] = useState<string[]>(
    meals
      .flatMap((meal) => meal.foodItems)
      .filter((food) => food.completed)
      .map((food) => food.id),
  )
  const [localCompletedMeals, setLocalCompletedMeals] = useState<string[]>(
    meals.filter((meal) => meal.completed).map((meal) => meal.id),
  )
  const [loadingFoodItemId, setLoadingFoodItemId] = useState<string | null>(null)
  const [loadingMealId, setLoadingMealId] = useState<string | null>(null)

  const { mutate: completeFoodItemMutation, isPending: isLoadingFoodItem } = useCompleteFoodItemMutation()
  const { mutate: completeMealMutation, isPending: isLoadingMeal } = useCompleteMealMutation()
  const { mutate: completeAllMealsMutation, isPending: loadingAllMeals } = useCompleteAllMealsMutation()

  const today = getCurrentDayOfWeek() as DayOfWeek

  useEffect(() => {
    setLocalCompletedFoodItems(
      meals
        .flatMap((meal) => meal.foodItems)
        .filter((food) => food.completed)
        .map((food) => food.id),
    )
    setLocalCompletedMeals(meals.filter((meal) => meal.completed).map((meal) => meal.id))
  }, [meals])

  useEffect(() => {
    if (!isLoadingFoodItem) {
      setLoadingFoodItemId(null)
    }
    if (!isLoadingMeal) {
      setLoadingMealId(null)
    }
  }, [isLoadingFoodItem, isLoadingMeal])

  const sortedMeals = [...meals].sort((a, b) => {
    const mealOrder = {
      BREAKFAST: 1,
      PRE_WORKOUT: 2,
      LUNCH: 3,
      SNACK: 4,
      POST_WORKOUT: 5,
      DINNER: 6,
      OTHER: 7,
    }
    return mealOrder[a.mealType] - mealOrder[b.mealType]
  })

  const toggleFoodItemCompletion = (foodItemId: string, mealId: string) => {
    const isCompleted = localCompletedFoodItems.includes(foodItemId)

    setLocalCompletedFoodItems((prev) => {
      if (isCompleted) {
        return prev.filter((id) => id !== foodItemId)
      } else {
        return [...prev, foodItemId]
      }
    })

    setLoadingFoodItemId(foodItemId)

    completeFoodItemMutation({
      foodItemId,
      mealId,
      nutritionalPlanId,
      facilityId,
      completed: !isCompleted,
      dayOfWeek: today,
    })
  }

  const toggleMealCompletion = (mealId: string) => {
    const isCompleted = localCompletedMeals.includes(mealId)

    setLocalCompletedMeals((prev) => {
      if (isCompleted) {
        return prev.filter((id) => id !== mealId)
      } else {
        return [...prev, mealId]
      }
    })

    setLoadingMealId(mealId)

    completeMealMutation({
      mealId,
      nutritionalPlanId,
      facilityId,
      completed: !isCompleted,
      dayOfWeek: today,
    })
  }

  const handleCompleteAll = () => {
    const mealIds = meals.map((meal) => meal.id)
    const allCompleted = mealIds.every((id) => localCompletedMeals.includes(id))

    const newCompletionState = !allCompleted

    if (newCompletionState) {
      setLocalCompletedMeals(mealIds)
      setLocalCompletedFoodItems(meals.flatMap((meal) => meal.foodItems).map((food) => food.id))
    } else {
      setLocalCompletedMeals([])
      setLocalCompletedFoodItems([])
    }

    completeAllMealsMutation({
      mealIds,
      nutritionalPlanId,
      facilityId,
      completed: newCompletionState,
      dayOfWeek: today,
    })
  }

  const isFoodItemCompleted = (foodItemId: string) => {
    return localCompletedFoodItems.includes(foodItemId)
  }

  const isMealCompleted = (mealId: string) => {
    return localCompletedMeals.includes(mealId)
  }

  const isFoodItemLoading = (foodItemId: string) => {
    return loadingFoodItemId === foodItemId || loadingAllMeals
  }

  const isMealLoading = (mealId: string) => {
    return loadingMealId === mealId || loadingAllMeals
  }

  const areAllMealsCompleted = meals.length > 0 && meals.every((meal) => localCompletedMeals.includes(meal.id))

  return (
    <div className="space-y-3">
      {meals.length > 0 && (
        <div className="flex justify-end mb-2">
          <LoadingButton
            loading={loadingAllMeals}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleCompleteAll}
            style={{
              borderColor: primaryColor,
              color: areAllMealsCompleted ? "white" : primaryColor,
              backgroundColor: areAllMealsCompleted ? primaryColor : "transparent",
            }}
          >
            <CheckSquare className="h-4 w-4" />
            <span>{areAllMealsCompleted ? "Desmarcar todas" : "Completar todas"}</span>
          </LoadingButton>
        </div>
      )}

      {sortedMeals.map((meal) => (
        <Card key={meal.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge
                  variant={isMealCompleted(meal.id) ? "default" : "outline"}
                  style={{
                    backgroundColor: isMealCompleted(meal.id) ? primaryColor : "transparent",
                    borderColor: primaryColor,
                    color: isMealCompleted(meal.id) ? "white" : primaryColor,
                  }}
                >
                  {MEAL_TYPE_DISPLAY_NAMES[meal.mealType]}
                </Badge>
                {meal.time && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>{meal.time}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {meal.foodItems.map((food, index) => (
                <div key={food.id}>
                  {index > 0 && <Separator className="my-2" />}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`food-${food.id}`}
                        checked={isFoodItemCompleted(food.id)}
                        onCheckedChange={() => toggleFoodItemCompletion(food.id, meal.id)}
                        disabled={isFoodItemLoading(food.id)}
                        style={{
                          borderColor: isFoodItemCompleted(food.id) ? primaryColor : undefined,
                          backgroundColor: isFoodItemCompleted(food.id) ? primaryColor : undefined,
                        }}
                      />
                      <label
                        htmlFor={`food-${food.id}`}
                        className={`text-sm cursor-pointer ${isFoodItemLoading(food.id) ? "text-muted-foreground" : ""
                          }`}
                      >
                        {food.name}
                      </label>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {food.portion} {food.unit}
                    </span>
                  </div>
                  {food.calories && (
                    <div className="text-xs text-muted-foreground mt-1 ml-6">
                      <span>{food.calories} kcal</span>
                      {food.protein && <span> • {food.protein}g proteína</span>}
                      {food.carbs && <span> • {food.carbs}g carbohidratos</span>}
                      {food.fat && <span> • {food.fat}g grasas</span>}
                    </div>
                  )}
                  {food.notes && (
                    <p className="text-xs text-muted-foreground mt-1 ml-6">{food.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="px-4 py-2 border-t">
            <div className="flex items-center gap-2">
              <Checkbox
                id={`complete-${meal.id}`}
                checked={isMealCompleted(meal.id)}
                onCheckedChange={() => toggleMealCompletion(meal.id)}
                disabled={isMealLoading(meal.id)}
                style={{
                  borderColor: isMealCompleted(meal.id) ? primaryColor : undefined,
                  backgroundColor: isMealCompleted(meal.id) ? primaryColor : undefined,
                }}
              />
              <div className="flex items-center gap-2">
                {isMealLoading(meal.id) && (
                  <Loader2 className="h-3 w-3 animate-spin" style={{ color: primaryColor }} />
                )}
                <label
                  htmlFor={`complete-${meal.id}`}
                  className={`text-sm cursor-pointer ${isMealLoading(meal.id) ? "text-muted-foreground" : ""}`}
                >
                  Marcar comida completa
                </label>
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
