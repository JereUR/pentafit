"use client"

import { useState, useEffect, useMemo } from "react"
import { ChevronLeft, ChevronRight, CheckSquare } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { MealCard } from "./MealCard"
import EmptyState from "@/components/EmptyState"
import LoadingButton from "@/components/LoadingButton"
import { isDayTodayOrPast } from "@/lib/utils"
import { useCompleteAllMealsMutation } from "@/app/(main)/(authenticated)/(client)/[facilityId]/mi-plan-nutricional/mutations"
import { MealData, sortMealsByType } from "@/types/nutritionaPlansClient"
import type { DayOfWeek } from "@prisma/client"

interface MealCarouselProps {
  meals: MealData[]
  primaryColor: string
  dayName: string
  dayOfWeek: string
  nutritionalPlanId: string
  facilityId: string
  itemsPerPage?: number
}

export function MealCarousel({
  meals,
  primaryColor,
  dayName,
  dayOfWeek,
  nutritionalPlanId,
  facilityId,
  itemsPerPage = 3,
}: MealCarouselProps) {
  const sortedMeals = useMemo(() => sortMealsByType([...meals]), [meals])

  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [localCompletedMeals, setLocalCompletedMeals] = useState<string[]>([])
  const [localCompletedFoodItems, setLocalCompletedFoodItems] = useState<string[]>([])

  const { mutate: completeAllMealsMutation, isPending: loadingAllMeals } = useCompleteAllMealsMutation()

  const canMarkComplete = isDayTodayOrPast(dayOfWeek)

  useEffect(() => {
    setTotalPages(Math.max(1, Math.ceil(sortedMeals.length / itemsPerPage)))
  }, [sortedMeals.length, itemsPerPage])

  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(0)
    }
  }, [totalPages, currentPage])

  useEffect(() => {
    setLocalCompletedMeals(sortedMeals.filter((meal) => meal.completed).map((meal) => meal.id))
    setLocalCompletedFoodItems(
      sortedMeals
        .flatMap((meal) => meal.foodItems)
        .filter((food) => food.completed)
        .map((food) => food.id),
    )
  }, [sortedMeals])

  if (sortedMeals.length === 0) {
    return (
      <div className="flex justify-center py-6">
        <EmptyState
          title={`No hay plan de comidas para ${dayName}`}
          description="No tienes comidas programadas para este día."
          icon="food"
          primaryColor={primaryColor}
          showRedirectButton={false}
        />
      </div>
    )
  }

  const handleMealToggle = (mealId: string, completed: boolean) => {
    setLocalCompletedMeals((prev) => {
      if (completed) {
        return [...prev, mealId]
      } else {
        return prev.filter((id) => id !== mealId)
      }
    })
  }

  const handleFoodItemToggle = (foodItemId: string, completed: boolean) => {
    setLocalCompletedFoodItems((prev) => {
      if (completed) {
        return [...prev, foodItemId]
      } else {
        return prev.filter((id) => id !== foodItemId)
      }
    })
  }

  const handleCompleteAll = () => {
    const mealIds = sortedMeals.map((meal) => meal.id)
    const allCompleted = mealIds.every((id) => localCompletedMeals.includes(id))
    const newCompletionState = !allCompleted

    completeAllMealsMutation({
      mealIds,
      nutritionalPlanId,
      facilityId,
      completed: newCompletionState,
      dayOfWeek: dayOfWeek as DayOfWeek,
    })

    if (newCompletionState) {
      setLocalCompletedMeals(mealIds)
      setLocalCompletedFoodItems(sortedMeals.flatMap((meal) => meal.foodItems).map((food) => food.id))
    } else {
      setLocalCompletedMeals([])
      setLocalCompletedFoodItems([])
    }
  }

  const currentMeals = sortedMeals.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  const areAllMealsCompleted =
    sortedMeals.length > 0 && sortedMeals.every((meal) => localCompletedMeals.includes(meal.id))

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const gridCols = Math.min(itemsPerPage, currentMeals.length)
  const gridClass = gridCols === 1 ? "grid-cols-1" : gridCols === 2 ? "grid-cols-2" : "grid-cols-3"

  return (
    <div className="relative">
      {canMarkComplete && sortedMeals.length > 0 && (
        <div className="flex justify-end mb-4">
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

      <div className={`grid ${gridClass} gap-4 mx-auto justify-center`}>
        {currentMeals.map((meal, index) => (
          <MealCard
            key={meal.id}
            meal={{
              ...meal,
              completed: localCompletedMeals.includes(meal.id),
              foodItems: meal.foodItems.map((food) => ({
                ...food,
                completed: localCompletedFoodItems.includes(food.id),
              })),
            }}
            primaryColor={primaryColor}
            mealNumber={currentPage * itemsPerPage + index + 1}
            nutritionalPlanId={nutritionalPlanId}
            facilityId={facilityId}
            dayOfWeek={dayOfWeek}
            onMealToggle={handleMealToggle}
            onFoodItemToggle={handleFoodItemToggle}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevPage}
            className="rounded-full"
            style={{ borderColor: primaryColor }}
          >
            <ChevronLeft className="h-5 w-5" style={{ color: primaryColor }} />
          </Button>

          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${index === currentPage ? "w-6" : "w-2 bg-muted hover:bg-primary/50"
                  }`}
                style={index === currentPage ? { backgroundColor: primaryColor } : undefined}
                onClick={() => setCurrentPage(index)}
                aria-label={`Ir a la página ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={goToNextPage}
            className="rounded-full"
            style={{ borderColor: primaryColor }}
          >
            <ChevronRight className="h-5 w-5" style={{ color: primaryColor }} />
          </Button>
        </div>
      )}
    </div>
  )
}
