"use client"

import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { FoodItemValues } from "@/lib/validation"

interface FoodItemListProps {
  foodItems: FoodItemValues[]
  onEditFoodItem: (index: number) => void
  onDeleteFoodItem: (index: number) => void
}

export function FoodItemList({ foodItems, onEditFoodItem, onDeleteFoodItem }: FoodItemListProps) {
  if (foodItems.length === 0) {
    return <div className="text-center py-6 text-muted-foreground">No hay alimentos agregados a esta comida</div>
  }

  return (
    <div className="space-y-3">
      {foodItems.map((foodItem, foodItemIndex) => (
        <div key={foodItemIndex} className="bg-muted/50 rounded-md p-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium">{foodItem.name}</div>
              <div className="text-sm text-muted-foreground">
                {foodItem.portion} {foodItem.unit}
                {foodItem.calories ? ` • ${foodItem.calories} kcal` : ""}
              </div>
              {(foodItem.protein || foodItem.carbs || foodItem.fat) && (
                <div className="text-sm text-muted-foreground mt-1">
                  {foodItem.protein ? `Proteínas: ${foodItem.protein}g ` : ""}
                  {foodItem.carbs ? `Carbohidratos: ${foodItem.carbs}g ` : ""}
                  {foodItem.fat ? `Grasas: ${foodItem.fat}g` : ""}
                </div>
              )}
              {foodItem.notes && <div className="text-sm mt-1">{foodItem.notes}</div>}
            </div>
            <div className="flex gap-1">
              <Button type="button" variant="ghost" size="icon" onClick={() => onEditFoodItem(foodItemIndex)} className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onDeleteFoodItem(foodItemIndex)}
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

