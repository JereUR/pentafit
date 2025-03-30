import { Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MEAL_TYPE_DISPLAY_NAMES } from "@/lib/utils"
import { MealData } from "@/types/nutritionalPlans"

interface MealListProps {
  meals: MealData[]
}

export function MealList({ meals }: MealListProps) {
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

  return (
    <div className="space-y-3">
      {sortedMeals.map((meal) => (
        <Card key={meal.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{MEAL_TYPE_DISPLAY_NAMES[meal.mealType]}</Badge>
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
                  <div className="flex justify-between">
                    <span className="font-medium">{food.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {food.portion} {food.unit}
                    </span>
                  </div>
                  {food.calories && (
                    <div className="text-xs text-muted-foreground mt-1">
                      <span>{food.calories} kcal</span>
                      {food.protein && <span> • {food.protein}g proteína</span>}
                      {food.carbs && <span> • {food.carbs}g carbohidratos</span>}
                      {food.fat && <span> • {food.fat}g grasas</span>}
                    </div>
                  )}
                  {food.notes && <p className="text-xs text-muted-foreground mt-1">{food.notes}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

