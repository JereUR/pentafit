"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MealCard } from "./MealCard"
import EmptyState from "@/components/EmptyState"
import { sortMealsByType, type MealData } from "@/types/nutritionalPlans"

interface MealCarouselProps {
  meals: MealData[]
  primaryColor: string
  dayName: string
  itemsPerPage?: number
}

export function MealCarousel({ meals, primaryColor, dayName, itemsPerPage = 3 }: MealCarouselProps) {
  const sortedMeals = sortMealsByType(meals)

  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(Math.ceil(sortedMeals.length / itemsPerPage))

  const updateTotalPages = useCallback(() => {
    setTotalPages(Math.ceil(sortedMeals.length / itemsPerPage))
  }, [sortedMeals.length, itemsPerPage])

  useEffect(() => {
    updateTotalPages()
  }, [updateTotalPages])

  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(0)
    }
  }, [totalPages, currentPage])

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

  const currentMeals = sortedMeals.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

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
      <div className={`grid ${gridClass} gap-4 mx-auto justify-center`}>
        {currentMeals.map((meal, index) => (
          <MealCard
            key={meal.id}
            mealType={meal.mealType}
            time={meal.time}
            foodItems={meal.foodItems}
            primaryColor={primaryColor}
            mealNumber={currentPage * itemsPerPage + index + 1}
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
