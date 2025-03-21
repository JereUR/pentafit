"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { useAllPresetRoutines } from "@/hooks/useAllPresetRoutines"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import type { RoutineValues } from "@/lib/validation"
import type { RoutineData } from "@/types/routine"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface PresetRoutineSelectorProps {
  onSelectPreset: (presetRoutine: RoutineValues) => void
}

export function PresetRoutineSelector({ onSelectPreset }: PresetRoutineSelectorProps) {
  const { workingFacility } = useWorkingFacility()
  const [open, setOpen] = useState(false)
  const [selectedRoutine, setSelectedRoutine] = useState<RoutineData | null>(null)

  const { data, isLoading } = useAllPresetRoutines(workingFacility?.id)

  const presetRoutines = data?.allPresetRoutines || []

  const handleSelectPreset = (presetRoutine: RoutineData) => {
    setSelectedRoutine(presetRoutine)

    const routineValues: RoutineValues = {
      name: presetRoutine.name,
      description: presetRoutine.description || "",
      facilityId: presetRoutine.facilityId,
      dailyExercises: presetRoutine.dailyExercises.reduce(
        (acc, dailyExercise) => {
          const day = dailyExercise.dayOfWeek
          return {
            ...acc,
            [day]: dailyExercise.exercises.map((exercise) => ({
              name: exercise.name,
              bodyZone: exercise.bodyZone,
              series: exercise.series,
              count: exercise.count,
              measure: exercise.measure,
              rest: exercise.rest,
              description: exercise.description,
              photoUrl: exercise.photoUrl,
            })),
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
    }

    onSelectPreset(routineValues)
    setOpen(false)
  }

  return (
    <div className="flex flex-col space-y-2 mb-6">
      <label className="text-sm font-medium">Seleccionar rutina preestablecida</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between">
            {isLoading ? (
              <Skeleton className="h-4 w-[150px]" />
            ) : selectedRoutine ? (
              <span className="truncate max-w-[250px]">{selectedRoutine.name}</span>
            ) : (
              "Seleccionar rutina preestablecida"
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[300px]">
          <Command>
            <CommandInput placeholder="Buscar rutina..." />
            {isLoading ? (
              <div className="p-2">
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <CommandList>
                <CommandEmpty>No se encontraron rutinas.</CommandEmpty>
                <CommandGroup>
                  {presetRoutines.map((routine) => (
                    <CommandItem key={routine.id} value={routine.id} onSelect={() => handleSelectPreset(routine)}>
                      <Check
                        className={cn("mr-2 h-4 w-4", selectedRoutine?.id === routine.id ? "opacity-100" : "opacity-0")}
                      />
                      <div className="flex flex-col">
                        <span>{routine.name}</span>
                        {routine.description && (
                          <span className="text-xs text-muted-foreground truncate max-w-[220px]">
                            {routine.description}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

