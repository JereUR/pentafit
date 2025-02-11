import { type Control, useFieldArray, useWatch, type UseFormSetValue } from "react-hook-form"
import { PlusCircle, Trash2 } from "lucide-react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { AllDIaryData } from "@/types/diary"
import type { PlanValues } from "@/lib/validation"
import { daysOfWeek } from "@/lib/utils"

interface ActivitySelectorProps {
  control: Control<PlanValues>
  setValue: UseFormSetValue<PlanValues>
  diaries: AllDIaryData[]
}

export function ActivitySelector({ control, setValue, diaries }: ActivitySelectorProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "diaryPlans",
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Actividades del Plan</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              name: "",
              activityId: "",
              daysOfWeek: [false, false, false, false, false, false, false],
              sessionsPerWeek: 1,
            })
          }
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Actividad
        </Button>
      </div>
      {fields.map((field, index) => (
        <ActivityItem
          key={field.id}
          control={control}
          setValue={setValue}
          index={index}
          diaries={diaries}
          onRemove={() => remove(index)}
        />
      ))}
    </div>
  )
}

interface ActivityItemProps {
  control: Control<PlanValues>
  setValue: UseFormSetValue<PlanValues>
  index: number
  diaries: AllDIaryData[]
  onRemove: () => void
}

function ActivityItem({ control, setValue, index, diaries, onRemove }: ActivityItemProps) {

  const watchActivityId = useWatch({
    control,
    name: `diaryPlans.${index}.activityId`,
  })

  const watchDaysOfWeek = useWatch({
    control,
    name: `diaryPlans.${index}.daysOfWeek`,
  })

  const selectedDiary = diaries.find((diary) => diary.id === watchActivityId)
  const selectedDays = watchDaysOfWeek ? watchDaysOfWeek.filter(Boolean).length : 0

  return (
    <div className="p-4 border rounded-md space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-md font-medium">{selectedDiary ? selectedDiary.activityName : `Actividad ${index + 1}`}</h4>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <FormField
        control={control}
        name={`diaryPlans.${index}.activityId`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Seleccionar Actividad/Diary</FormLabel>
            <Select
              onValueChange={(value) => {
                const selectedDiary = diaries.find((diary) => diary.id === value)
                if (selectedDiary) {
                  setValue(`diaryPlans.${index}.name`, selectedDiary.activityName)
                  setValue(`diaryPlans.${index}.activityId`, selectedDiary.id)
                }
                field.onChange(value)
              }}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una actividad" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {diaries.map((diary) => (
                  <SelectItem key={diary.id} value={diary.id}>
                    {diary.name} - {diary.activityName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`diaryPlans.${index}.daysOfWeek`}
        render={() => (
          <FormItem>
            <FormLabel>Días de la Semana</FormLabel>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day, dayIndex) => (
                <FormField
                  key={dayIndex}
                  control={control}
                  name={`diaryPlans.${index}.daysOfWeek.${dayIndex}`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={selectedDiary && !selectedDiary.daysAvailable[dayIndex].available}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">{day}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`diaryPlans.${index}.sessionsPerWeek`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sesiones máximas por Semana</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                min={1}
                max={selectedDays}
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value, 10)
                  if (value > selectedDays) {
                    field.onChange(selectedDays)
                  } else {
                    field.onChange(value)
                  }
                }}
              />
            </FormControl>
            <FormMessage />
            {field.value > selectedDays && (
              <p className="text-sm text-red-500">
                El número de sesiones no puede ser mayor que la cantidad de días seleccionados ({selectedDays}).
              </p>
            )}
          </FormItem>
        )}
      />
    </div>
  )
}

