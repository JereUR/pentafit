"use client"

import { useState, useEffect } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { foodItemSchema, type FoodItemValues } from "@/lib/validation"
import { formatZodErrors } from "@/lib/utils"

interface FoodItemFormProps {
  onSubmit: (foodItem: FoodItemValues) => void
  onCancel: () => void
  initialFoodItem?: FoodItemValues
  isEditing?: boolean
}

export function FoodItemForm({ onSubmit, onCancel, initialFoodItem, isEditing = false }: FoodItemFormProps) {
  const [foodName, setFoodName] = useState("")
  const [portion, setPortion] = useState<number | null>(null)
  const [unit, setUnit] = useState("")
  const [calories, setCalories] = useState<number | null>(null)
  const [protein, setProtein] = useState<number | null>(null)
  const [carbs, setCarbs] = useState<number | null>(null)
  const [fat, setFat] = useState<number | null>(null)
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialFoodItem) {
      setFoodName(initialFoodItem.name)
      setPortion(initialFoodItem.portion)
      setUnit(initialFoodItem.unit)
      setCalories(initialFoodItem.calories)
      setProtein(initialFoodItem.protein)
      setCarbs(initialFoodItem.carbs)
      setFat(initialFoodItem.fat)
      setNotes(initialFoodItem.notes || "")
    }
  }, [initialFoodItem])

  const validate = () => {
    try {
      foodItemSchema.parse({
        name: foodName,
        portion: portion || 0,
        unit,
        calories,
        protein,
        carbs,
        fat,
        notes: notes || null,
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

    const foodItem: FoodItemValues = {
      name: foodName,
      portion: portion!,
      unit,
      calories,
      protein,
      carbs,
      fat,
      notes: notes || null,
    }

    onSubmit(foodItem)

    // Reset form
    setFoodName("")
    setPortion(null)
    setUnit("")
    setCalories(null)
    setProtein(null)
    setCarbs(null)
    setFat(null)
    setNotes("")
    setErrors({})
  }

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Editar Alimento" : "Agregar Alimento"}</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="foodName">Nombre</Label>
          <Input
            id="foodName"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            placeholder="Nombre del alimento"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="portion">Porción</Label>
          <Input
            id="portion"
            type="number"
            value={portion === null ? "" : portion}
            onChange={(e) => setPortion(e.target.value ? Number(e.target.value) : null)}
            placeholder="Cantidad"
            className={errors.portion ? "border-destructive" : ""}
          />
          {errors.portion && <p className="text-sm text-destructive">{errors.portion}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">Unidad</Label>
          <Input
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="g, ml, unidad, etc."
            className={errors.unit ? "border-destructive" : ""}
          />
          {errors.unit && <p className="text-sm text-destructive">{errors.unit}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="calories">Calorías (opcional)</Label>
          <Input
            id="calories"
            type="number"
            value={calories === null ? "" : calories}
            onChange={(e) => setCalories(e.target.value ? Number(e.target.value) : null)}
            placeholder="kcal"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="protein">Proteínas (opcional)</Label>
          <Input
            id="protein"
            type="number"
            value={protein === null ? "" : protein}
            onChange={(e) => setProtein(e.target.value ? Number(e.target.value) : null)}
            placeholder="g"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="carbs">Carbohidratos (opcional)</Label>
          <Input
            id="carbs"
            type="number"
            value={carbs === null ? "" : carbs}
            onChange={(e) => setCarbs(e.target.value ? Number(e.target.value) : null)}
            placeholder="g"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fat">Grasas (opcional)</Label>
          <Input
            id="fat"
            type="number"
            value={fat === null ? "" : fat}
            onChange={(e) => setFat(e.target.value ? Number(e.target.value) : null)}
            placeholder="g"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notas (opcional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notas adicionales"
            className="resize-none"
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </DialogClose>
        <Button onClick={handleSubmit}>{isEditing ? "Actualizar" : "Agregar"}</Button>
      </DialogFooter>
    </DialogContent>
  )
}

