"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { mealTypes } from "@/types/nutritionalPlans"
import { mealSchema, type MealValues } from "@/lib/validation"
import type { MealType } from "@prisma/client"
import { formatZodErrors } from "@/lib/utils"
import type { DailyMealsValues } from "@/lib/validation"

interface MealFormProps {
  onSubmit: (meal: MealValues) => void
  onCancel: () => void
  initialMeal?: MealValues
  isEditing?: boolean
  dailyMeals: DailyMealsValues
  currentDay: keyof DailyMealsValues
}

export function MealForm({
  onSubmit,
  onCancel,
  initialMeal,
  isEditing = false,
  dailyMeals,
  currentDay,
}: MealFormProps) {
  const [mealType, setMealType] = useState<MealType | "">("")
  const [mealTime, setMealTime] = useState<string>("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialMeal) {
      setMealType(initialMeal.mealType)
      setMealTime(initialMeal.time || "")
    } else {
      setMealType("")
      setMealTime("")
    }
  }, [initialMeal])

  const validate = () => {
    try {
      mealSchema.parse({
        mealType,
        time: mealTime || null,
        foodItems: [],
      })
      setErrors({})
      return true
    } catch (error) {
      const formattedErrors = formatZodErrors(error)
      setErrors(formattedErrors)
      return false
    }
  }

  const handleSubmit = () => {
    if (!validate()) return

    const meal: MealValues = {
      mealType: mealType as MealType,
      time: mealTime || null,
      foodItems: [],
    }

    onSubmit(meal)

    setMealType("")
    setMealTime("")
    setErrors({})
  }

  // Filter available meal types to prevent duplicates
  const getAvailableMealTypes = () => {
    return mealTypes.map((type) => {
      // If we're editing, the current meal type should be available
      const isDisabled =
        initialMeal?.mealType === type.value
          ? false
          : dailyMeals[currentDay]?.some((meal) => meal.mealType === type.value)

      return {
        ...type,
        disabled: isDisabled,
      }
    })
  }

  const availableMealTypes = getAvailableMealTypes()

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Editar Comida" : "Agregar Comida"}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="mealType">Tipo de Comida</Label>
          <Select value={mealType} onValueChange={(value) => setMealType(value as MealType)}>
            <SelectTrigger id="mealType" className={errors.mealType ? "border-destructive" : ""}>
              <SelectValue placeholder="Seleccione un tipo" />
            </SelectTrigger>
            <SelectContent>
              {availableMealTypes.map((type) => (
                <SelectItem key={type.value} value={type.value} disabled={type.disabled}>
                  {type.label} {type.disabled && "(Ya agregado)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.mealType && <p className="text-sm text-destructive">{errors.mealType}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="mealTime">Hora (opcional)</Label>
          <div className="relative">
            <Input
              id="mealTime"
              type="time"
              value={mealTime}
              onChange={(e) => setMealTime(e.target.value)}
              className="pl-10"
            />
            <Clock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </DialogClose>
        <Button type="button" onClick={handleSubmit}>
          {isEditing ? "Actualizar" : "Agregar"}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

