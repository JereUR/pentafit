"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { daysOfWeekMap } from "@/lib/utils"
import { type DailyMealData, mealTypes } from "@/types/nutritionalPlans"

interface MealsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dailyMeals: DailyMealData[]
  planName: string
}

export function MealsDialog({ open, onOpenChange, dailyMeals, planName }: MealsDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const defaultTab = dailyMeals.length > 0 ? dailyMeals[0].dayOfWeek : "MONDAY"

  const mealCounts = dailyMeals.reduce(
    (counts, day) => {
      counts[day.dayOfWeek] = day.meals.length
      return counts
    },
    {} as Record<string, number>,
  )

  // Función para obtener la etiqueta legible del tipo de comida
  const getMealTypeLabel = (mealType: string) => {
    return mealTypes.find((type) => type.value === mealType)?.label || mealType
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px] max-h-[90vh] max-w-[95vw] rounded-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Comidas de {planName}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue={defaultTab} className="w-full">
          {isMobile ? (
            <ScrollArea className="w-full pb-2">
              <TabsList className="grid w-full grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mb-4 h-fit">
                {daysOfWeekMap.map((day) => (
                  <TabsTrigger key={day.value} value={day.value} className="text-xs relative">
                    {day.label.substring(0, 3)}
                    {mealCounts[day.value] > 0 && (
                      <span className="absolute -top-1 -right-1 bg-foreground text-primary z-50 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {mealCounts[day.value]}
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
                  {mealCounts[day.value] > 0 && (
                    <span className="absolute -top-1 -right-1 bg-foreground text-primary z-50 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {mealCounts[day.value]}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          )}

          {daysOfWeekMap.map((day) => {
            const dailyMeal = dailyMeals.find((dm) => dm.dayOfWeek === day.value)
            const meals = dailyMeal?.meals || []

            return (
              <TabsContent key={day.value} value={day.value} className="mt-4">
                <ScrollArea className="h-[400px] md:h-[500px] rounded-md border p-4">
                  {meals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {meals.map((meal) => (
                        <div key={meal.id} className="border rounded-lg p-4 shadow-sm">
                          <div className="flex flex-col h-full">
                            <div className="flex-1">
                              <h4 className="font-medium text-lg text-primary">{getMealTypeLabel(meal.mealType)}</h4>
                              <div className="text-sm mb-2">{meal.time && <span>Hora: {meal.time}</span>}</div>

                              <h5 className="font-medium text-sm mt-3 mb-1">Alimentos:</h5>
                              {meal.foodItems.length > 0 ? (
                                <div className="space-y-2">
                                  {meal.foodItems.map((item) => (
                                    <div key={item.id} className="text-sm border-l-2 border-primary pl-2">
                                      <div className="font-medium">{item.name}</div>
                                      <div className="grid grid-cols-2 gap-1 text-xs">
                                        <div>
                                          <span className="font-semibold">Porción: </span>
                                          {item.portion} {item.unit}
                                        </div>
                                        {item.calories !== null && (
                                          <div>
                                            <span className="font-semibold">Calorías: </span>
                                            {item.calories}
                                          </div>
                                        )}
                                        {item.protein !== null && (
                                          <div>
                                            <span className="font-semibold">Proteínas: </span>
                                            {item.protein}g
                                          </div>
                                        )}
                                        {item.carbs !== null && (
                                          <div>
                                            <span className="font-semibold">Carbohidratos: </span>
                                            {item.carbs}g
                                          </div>
                                        )}
                                        {item.fat !== null && (
                                          <div>
                                            <span className="font-semibold">Grasas: </span>
                                            {item.fat}g
                                          </div>
                                        )}
                                      </div>
                                      {item.notes && (
                                        <div className="text-xs mt-1">
                                          <span className="font-semibold">Notas: </span>
                                          {item.notes}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground">
                                  No hay alimentos registrados para esta comida
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-center text-muted-foreground py-8">No hay comidas para este día</p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            )
          })}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

