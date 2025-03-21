"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import { cn } from "@/lib/utils"
import type { NutritionalPlanValues } from "@/lib/validation"
import { useAllPresetNutritionalPlans } from "@/hooks/useAllPresetNutritionalPlans"

interface PresetNutritionalPlanSelectorProps {
  onSelectPreset: (presetNutritionalPlan: NutritionalPlanValues) => void
}

export function PresetNutritionalPlanSelector({ onSelectPreset }: PresetNutritionalPlanSelectorProps) {
  const [open, setOpen] = useState(false)
  const [selectedPresetId, setSelectedPresetId] = useState<string>("")
  const { workingFacility } = useWorkingFacility()

  const { data: presetNutritionalPlans, isLoading } = useAllPresetNutritionalPlans(workingFacility?.id || "")

  const handleSelectPreset = (presetId: string) => {
    const selectedPreset = presetNutritionalPlans.find((preset) => preset.id === presetId)
    if (selectedPreset) {
      setSelectedPresetId(presetId)
      onSelectPreset({
        name: selectedPreset.name,
        description: selectedPreset.description || "",
        facilityId: selectedPreset.facilityId,
        dailyMeals: selectedPreset.dailyMeals.reduce(
          (acc, dailyMeal) => {
            const dayOfWeek = dailyMeal.dayOfWeek
            const meals = dailyMeal.meals.map((meal) => ({
              mealType: meal.mealType,
              time: meal.time,
              foodItems: meal.foodItems.map((foodItem) => ({
                name: foodItem.name,
                portion: foodItem.portion,
                unit: foodItem.unit,
                calories: foodItem.calories,
                protein: foodItem.protein,
                carbs: foodItem.carbs,
                fat: foodItem.fat,
                notes: foodItem.notes,
              })),
            }))
            return {
              ...acc,
              [dayOfWeek]: meals,
            }
          },
          {
            MONDAY: [],
            TUESDAY: [],
            WEDNESDAY: [],
            THURSDAY: [],
            FRIDAY: [],
            SATURDAY: [],
            SUNDAY: [],
          },
        ),
      })
      setOpen(false)
    }
  }

  if (presetNutritionalPlans.length === 0 && !isLoading) {
    return null
  }

  return (
    <div className="mb-6">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {selectedPresetId
              ? presetNutritionalPlans.find((preset) => preset.id === selectedPresetId)?.name
              : "Seleccionar plan nutricional predefinido..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Buscar plan nutricional..." />
            <CommandList>
              <CommandEmpty>No se encontraron planes nutricionales predefinidos.</CommandEmpty>
              <CommandGroup>
                {presetNutritionalPlans.map((preset) => (
                  <CommandItem key={preset.id} value={preset.id} onSelect={() => handleSelectPreset(preset.id)}>
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedPresetId === preset.id ? "opacity-100" : "opacity-0")}
                    />
                    {preset.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

