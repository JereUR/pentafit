"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, CirclePlus, Pencil, Trash2 } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ExerciseValues, DailyExercisesValues } from "@/lib/validation"
import { convertImagePath, getBodyZones, getExercisesByZone } from "@/data/exercisesData"
import noImage from "@/assets/no-image.png"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { cn, daysOfWeekMap } from "@/lib/utils"

interface ExercisesTabRoutineFormProps {
  dailyExercises: DailyExercisesValues
  setDailyExercises: React.Dispatch<React.SetStateAction<DailyExercisesValues>>
}

export function ExercisesTabRoutineForm({ dailyExercises, setDailyExercises }: ExercisesTabRoutineFormProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [name, setName] = useState("")
  const [bodyZone, setBodyZone] = useState("")
  const [series, setSeries] = useState<number | null>(null)
  const [count, setCount] = useState<number | null>(null)
  const [measure, setMeasure] = useState("")
  const [rest, setRest] = useState<number | null>(null)
  const [description, setDescription] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [availableExercises, setAvailableExercises] = useState<Array<{ exercise: string; photo: string }>>([])
  const [currentDay, setCurrentDay] = useState<keyof DailyExercisesValues>("MONDAY")

  const bodyZones = getBodyZones()

  useEffect(() => {
    if (bodyZone) {
      const exercises = getExercisesByZone(bodyZone)
      setAvailableExercises(exercises)
    } else {
      setAvailableExercises([])
    }
  }, [bodyZone])

  const validateExercise = () => {
    const newErrors: Record<string, string> = {}

    if (!name) newErrors.name = "El nombre es requerido"
    if (!bodyZone) newErrors.bodyZone = "La zona del cuerpo es requerida"
    if (!series || series <= 0) newErrors.series = "Las series deben ser al menos 1"
    if (!count || count <= 0) newErrors.count = "La cantidad debe ser al menos 1"
    if (!measure) newErrors.measure = "La medida es requerida"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const clearForm = () => {
    setName("")
    setBodyZone("")
    setSeries(null)
    setCount(null)
    setMeasure("")
    setRest(null)
    setDescription("")
    setPhotoUrl("")
    setEditingIndex(null)
    setErrors({})
  }

  const handleAddExercise = () => {
    if (!validateExercise()) return

    const processedPhotoUrl = photoUrl ? convertImagePath(photoUrl) : null

    const newExercise: ExerciseValues = {
      name,
      bodyZone,
      series: series!,
      count: count!,
      measure,
      rest,
      description: description || null,
      photoUrl: processedPhotoUrl,
    }

    if (editingIndex !== null) {
      const updatedExercises = [...dailyExercises[currentDay]]
      updatedExercises[editingIndex] = newExercise
      setDailyExercises({
        ...dailyExercises,
        [currentDay]: updatedExercises,
      })
    } else {
      setDailyExercises({
        ...dailyExercises,
        [currentDay]: [...dailyExercises[currentDay], newExercise],
      })
    }

    clearForm()
  }

  const handleEditExercise = (index: number) => {
    const exercise = dailyExercises[currentDay][index]
    setName(exercise.name)
    setBodyZone(exercise.bodyZone)
    setSeries(exercise.series)
    setCount(exercise.count)
    setMeasure(exercise.measure)
    setRest(exercise.rest || null)
    setDescription(exercise.description || "")
    setPhotoUrl(exercise.photoUrl || "")
    setEditingIndex(index)
  }

  const handleDeleteExercise = (index: number) => {
    const updatedExercises = [...dailyExercises[currentDay]]
    updatedExercises.splice(index, 1)
    setDailyExercises({
      ...dailyExercises,
      [currentDay]: updatedExercises,
    })
  }

  const handleExerciseSelect = (exerciseName: string) => {
    setName(exerciseName)

    const selectedExercise = availableExercises.find((ex) => ex.exercise === exerciseName)
    if (selectedExercise) {
      setPhotoUrl(selectedExercise.photo)
    }
  }

  const totalExercises = Object.values(dailyExercises).reduce((total, exercises) => total + exercises.length, 0)

  return (
    <div className="space-y-6">
      <Tabs value={currentDay} onValueChange={(value) => setCurrentDay(value as keyof DailyExercisesValues)}>
        {isMobile ? (
          <ScrollArea className="w-full pb-2">
            <TabsList className="grid w-full grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mb-4 h-fit">
              {daysOfWeekMap.map((day) => (
                <TabsTrigger key={day.value} value={day.value} className="relative">
                  {day.label.substring(0, 3)}
                  {dailyExercises[day.value as keyof DailyExercisesValues].length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-foreground text-primary z-50 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {dailyExercises[day.value as keyof DailyExercisesValues].length}
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
                {dailyExercises[day.value as keyof DailyExercisesValues].length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-foreground text-primary z-50 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {dailyExercises[day.value as keyof DailyExercisesValues].length}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bodyZone">Zona del cuerpo</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          id="bodyZone"
                          className={cn("w-full justify-between", errors.bodyZone ? "border-destructive" : "")}
                        >
                          {bodyZone || "Seleccione una zona"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-full">
                        <Command>
                          <CommandInput placeholder="Buscar zona..." />
                          <CommandList>
                            <CommandEmpty>No se encontraron zonas.</CommandEmpty>
                            <CommandGroup>
                              {bodyZones.map((zone) => (
                                <CommandItem
                                  key={zone}
                                  value={zone}
                                  onSelect={() => {
                                    setBodyZone(zone)
                                    setName("")
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", bodyZone === zone ? "opacity-100" : "opacity-0")} />
                                  {zone}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {errors.bodyZone && <p className="text-sm text-destructive">{errors.bodyZone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exercise">Ejercicio</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          id="exercise"
                          disabled={!bodyZone}
                          className={cn("w-full justify-between", errors.name ? "border-destructive" : "")}
                        >
                          {name || (bodyZone ? "Seleccione un ejercicio" : "Primero seleccione una zona")}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-full">
                        <Command>
                          <CommandInput placeholder="Buscar ejercicio..." />
                          <CommandList>
                            <CommandEmpty>No se encontraron ejercicios.</CommandEmpty>
                            <CommandGroup>
                              {availableExercises.map((ex, index) => (
                                <CommandItem key={index} value={ex.exercise} onSelect={() => handleExerciseSelect(ex.exercise)}>
                                  <Check className={cn("mr-2 h-4 w-4", name === ex.exercise ? "opacity-100" : "opacity-0")} />
                                  {ex.exercise}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="series">Series</Label>
                    <Input
                      id="series"
                      type="number"
                      value={series === null ? "" : series}
                      onChange={(e) => setSeries(e.target.value ? Number.parseInt(e.target.value) : null)}
                      placeholder="Número de series"
                      className={errors.series ? "border-destructive" : ""}
                    />
                    {errors.series && <p className="text-sm text-destructive">{errors.series}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="count">Cantidad</Label>
                    <Input
                      id="count"
                      type="number"
                      value={count === null ? "" : count}
                      onChange={(e) => setCount(e.target.value ? Number.parseInt(e.target.value) : null)}
                      placeholder="Cantidad"
                      className={errors.count ? "border-destructive" : ""}
                    />
                    {errors.count && <p className="text-sm text-destructive">{errors.count}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="measure">Medida</Label>
                    <Select value={measure} onValueChange={setMeasure}>
                      <SelectTrigger id="measure" className={errors.measure ? "border-destructive" : ""}>
                        <SelectValue placeholder="Seleccione una medida" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Repeticiones">Repeticiones</SelectItem>
                        <SelectItem value="Segundos">Segundos</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.measure && <p className="text-sm text-destructive">{errors.measure}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rest">Descanso (segundos)</Label>
                    <Input
                      id="rest"
                      type="number"
                      value={rest === null ? "" : rest}
                      onChange={(e) => setRest(e.target.value ? Number.parseInt(e.target.value) : null)}
                      placeholder="Tiempo de descanso"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Descripción del ejercicio"
                      className="resize-none"
                    />
                  </div>
                </div>

                {photoUrl && (
                  <div className="mt-6 rounded-lg bg-muted/50 p-0 overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center">
                      <div className="relative w-full md:w-1/3 h-[200px] bg-background">
                        <Image
                          src={convertImagePath(photoUrl) || noImage}
                          alt={name || "Ejercicio"}
                          fill
                          className="object-contain p-2"
                          onError={(e) => {
                            ; (e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=200"
                          }}
                        />
                      </div>
                      <div className="p-4 md:p-6 w-full md:w-2/3">
                        <h3 className="text-lg font-semibold text-primary mb-2">{name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {bodyZone} | {series || 0} series x {count || 0} {measure || "repeticiones"}
                          {rest ? ` | Descanso: ${rest}s` : ""}
                        </p>
                        <p className="text-sm">{description || "Sin descripción disponible."}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-center">
                  <Button
                    type="button"
                    onClick={handleAddExercise}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                  >
                    <CirclePlus className="h-5 w-5" />
                    {editingIndex !== null ? "Actualizar Ejercicio" : "Agregar Ejercicio"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {dailyExercises[currentDay].length > 0 && (
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-medium text-primary">
                  Ejercicios para {daysOfWeekMap.find((d) => d.value === currentDay)?.label} (
                  {dailyExercises[currentDay].length})
                </h3>
                <ScrollArea className="h-[400px] rounded-md border">
                  <div className="p-4 space-y-6">
                    {dailyExercises[currentDay].map((exercise, index) => (
                      <div key={index} className="bg-card rounded-lg p-4 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          {exercise.photoUrl && (
                            <div className="relative h-24 w-24 rounded-md overflow-hidden bg-muted flex-shrink-0 border border-border">
                              <Image
                                src={exercise.photoUrl || noImage}
                                alt={exercise.name}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  ; (e.target as HTMLImageElement).src = "/placeholder.svg?height=100&width=100"
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-primary">{exercise.name}</h4>
                              <div className="flex space-x-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditExercise(index)}
                                  className="text-muted-foreground hover:text-primary"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteExercise(index)}
                                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {exercise.bodyZone} | {exercise.series} series x {exercise.count} {exercise.measure}
                              {exercise.rest ? ` | Descanso: ${exercise.rest}s` : ""}
                            </p>
                            {exercise.description && <p className="text-sm">{exercise.description}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {totalExercises > 0 && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h3 className="font-medium">Resumen de ejercicios</h3>
          <div className={`grid ${isMobile ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-7"} gap-2 mt-2`}>
            {daysOfWeekMap.map((day) => (
              <div key={day.value} className="text-center">
                <div className="font-medium">{day.label}</div>
                <div
                  className={`text-lg ${dailyExercises[day.value as keyof DailyExercisesValues].length > 0 ? "text-primary" : "text-muted-foreground"}`}
                >
                  {dailyExercises[day.value as keyof DailyExercisesValues].length}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

