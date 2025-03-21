"use client"

import { Pencil, Trash2, Clock, Plus } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { mealTypes } from "@/types/nutritionalPlans"
import type { MealValues, FoodItemValues } from "@/lib/validation"
import { FoodItemForm } from "./FoodItemForm"
import { FoodItemList } from "./FoodItemList"

interface MealListProps {
  meals: MealValues[]
  onEditMeal: (index: number) => void
  onDeleteMeal: (index: number) => void
  onUpdateFoodItems: (mealIndex: number, updatedMeal: MealValues) => void
}

export function MealList({ meals, onEditMeal, onDeleteMeal, onUpdateFoodItems }: MealListProps) {
  const [isAddFoodItemOpen, setIsAddFoodItemOpen] = useState(false)
  const [currentMealIndex, setCurrentMealIndex] = useState<number | null>(null)
  const [editingFoodItemIndex, setEditingFoodItemIndex] = useState<number | null>(null)

  const openAddFoodItemDialog = (mealIndex: number) => {
    setCurrentMealIndex(mealIndex)
    setEditingFoodItemIndex(null)
    setIsAddFoodItemOpen(true)
  }

  const handleEditFoodItem = (mealIndex: number, foodItemIndex: number) => {
    setCurrentMealIndex(mealIndex)
    setEditingFoodItemIndex(foodItemIndex)
    setIsAddFoodItemOpen(true)
  }

  const handleDeleteFoodItem = (mealIndex: number, foodItemIndex: number) => {
    const meal = meals[mealIndex]
    const updatedFoodItems = [...meal.foodItems]
    updatedFoodItems.splice(foodItemIndex, 1)

    const updatedMeal = {
      ...meal,
      foodItems: updatedFoodItems,
    }

    onUpdateFoodItems(mealIndex, updatedMeal)
  }

  const handleAddFoodItem = (foodItem: FoodItemValues) => {
    if (currentMealIndex === null) return

    const meal = meals[currentMealIndex]
    let updatedFoodItems: FoodItemValues[]

    if (editingFoodItemIndex !== null) {
      updatedFoodItems = [...meal.foodItems]
      updatedFoodItems[editingFoodItemIndex] = foodItem
    } else {
      updatedFoodItems = [...meal.foodItems, foodItem]
    }

    const updatedMeal = {
      ...meal,
      foodItems: updatedFoodItems,
    }

    onUpdateFoodItems(currentMealIndex, updatedMeal)
    setIsAddFoodItemOpen(false)
  }

  return (
    <div className="space-y-6">
      {meals.map((meal, mealIndex) => (
        <div key={mealIndex} className="border rounded-lg p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">
                  {mealTypes.find((type) => type.value === meal.mealType)?.label || meal.mealType}
                </h3>
                {meal.time && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {meal.time}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <Button variant="outline" size="sm" onClick={() => onEditMeal(mealIndex)} className="h-8 px-2">
                <Pencil type="button" className="h-4 w-4 mr-1" />
                Editar
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onDeleteMeal(mealIndex)}
                className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Eliminar
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Alimentos</h4>
              <Dialog open={isAddFoodItemOpen} onOpenChange={setIsAddFoodItemOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => openAddFoodItemDialog(mealIndex)} className="h-8">
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar Alimento
                  </Button>
                </DialogTrigger>
                <FoodItemForm
                  onSubmit={handleAddFoodItem}
                  onCancel={() => setIsAddFoodItemOpen(false)}
                  initialFoodItem={
                    editingFoodItemIndex !== null && currentMealIndex === mealIndex
                      ? meal.foodItems[editingFoodItemIndex]
                      : undefined
                  }
                  isEditing={editingFoodItemIndex !== null}
                />
              </Dialog>
            </div>
            <FoodItemList
              foodItems={meal.foodItems}
              onEditFoodItem={(foodItemIndex) => handleEditFoodItem(mealIndex, foodItemIndex)}
              onDeleteFoodItem={(foodItemIndex) => handleDeleteFoodItem(mealIndex, foodItemIndex)}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

