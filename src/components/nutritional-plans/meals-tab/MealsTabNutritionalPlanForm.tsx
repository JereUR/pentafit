"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import type { MealValues, DailyMealsValues } from "@/lib/validation"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { daysOfWeekMap } from "@/lib/utils"
import { MealForm } from "./MealForm"
import { MealList } from "./MealList"
import { NutritionalPlanSummary } from "./NutritionalPlanSummary"

interface MealsTabNutritionalPlanFormProps {
  dailyMeals: DailyMealsValues
  setDailyMeals: React.Dispatch<React.SetStateAction<DailyMealsValues>>
}

export function MealsTabNutritionalPlanForm({ dailyMeals, setDailyMeals }: MealsTabNutritionalPlanFormProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [currentDay, setCurrentDay] = useState<keyof DailyMealsValues>("MONDAY")
  const [isAddMealOpen, setIsAddMealOpen] = useState(false)
  const [editingMealIndex, setEditingMealIndex] = useState<number | null>(null)

  const clearMealForm = () => {
    setEditingMealIndex(null)
  }

  const handleAddMeal = (meal: MealValues) => {
    if (editingMealIndex !== null) {
      const existingFoodItems = dailyMeals[currentDay][editingMealIndex].foodItems || []
      meal.foodItems = existingFoodItems

      const updatedMeals = [...dailyMeals[currentDay]]
      updatedMeals[editingMealIndex] = meal
      setDailyMeals({
        ...dailyMeals,
        [currentDay]: updatedMeals,
      })
    } else {
      setDailyMeals({
        ...dailyMeals,
        [currentDay]: [...dailyMeals[currentDay], meal],
      })
    }

    setEditingMealIndex(null)
    setIsAddMealOpen(false)
  }

  const handleEditMeal = (index: number) => {
    setEditingMealIndex(index)
    setIsAddMealOpen(true)
  }

  const handleDeleteMeal = (index: number) => {
    const updatedMeals = [...dailyMeals[currentDay]]
    updatedMeals.splice(index, 1)
    setDailyMeals({
      ...dailyMeals,
      [currentDay]: updatedMeals,
    })
  }

  const handleUpdateFoodItems = (mealIndex: number, updatedMeal: MealValues) => {
    const updatedMeals = [...dailyMeals[currentDay]]
    updatedMeals[mealIndex] = updatedMeal

    setDailyMeals({
      ...dailyMeals,
      [currentDay]: updatedMeals,
    })
  }

  const totalMeals = Object.values(dailyMeals).reduce((total, meals) => total + meals.length, 0)
  const totalFoodItems = Object.values(dailyMeals).reduce(
    (total, meals) => total + meals.reduce((mealTotal, meal) => mealTotal + meal.foodItems.length, 0),
    0,
  )

  return (
    <div className="space-y-6">
      <Tabs value={currentDay} onValueChange={(value) => setCurrentDay(value as keyof DailyMealsValues)}>
        {isMobile ? (
          <ScrollArea className="w-full pb-2">
            <TabsList className="grid w-full grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mb-4 h-fit">
              {daysOfWeekMap.map((day) => (
                <TabsTrigger key={day.value} value={day.value} className="relative">
                  {day.label.substring(0, 3)}
                  {dailyMeals[day.value as keyof DailyMealsValues].length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-foreground text-primary z-50 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {dailyMeals[day.value as keyof DailyMealsValues].length}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
        ) : (
          <TabsList className="grid grid-cols-7 w-full">
            {daysOfWeekMap.map((day) => (
              <TabsTrigger key={day.value} value={day.value} className="relative">
                {day.label}
                {dailyMeals[day.value as keyof DailyMealsValues].length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-foreground text-primary z-50 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {dailyMeals[day.value as keyof DailyMealsValues].length}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        )}
        {daysOfWeekMap.map((day) => (
          <TabsContent key={day.value} value={day.value}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-center mb-6">
                  <Dialog open={isAddMealOpen} onOpenChange={setIsAddMealOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={clearMealForm} className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Agregar Comida
                      </Button>
                    </DialogTrigger>
                    <MealForm
                      onSubmit={handleAddMeal}
                      onCancel={() => setIsAddMealOpen(false)}
                      initialMeal={editingMealIndex !== null ? dailyMeals[currentDay][editingMealIndex] : undefined}
                      isEditing={editingMealIndex !== null}
                    />
                  </Dialog>
                </div>

                {dailyMeals[currentDay].length > 0 ? (
                  <ScrollArea className="h-[500px] pr-4">
                    <MealList
                      meals={dailyMeals[currentDay]}
                      onEditMeal={handleEditMeal}
                      onDeleteMeal={handleDeleteMeal}
                      onUpdateFoodItems={handleUpdateFoodItems}
                    />
                  </ScrollArea>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">No hay comidas agregadas para este día</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      {totalMeals > 0 && (
        <NutritionalPlanSummary
          dailyMeals={dailyMeals}
          totalMeals={totalMeals}
          totalFoodItems={totalFoodItems}
          isMobile={isMobile}
        />
      )}
    </div>
  )
}

