import { type Control, useFieldArray } from "react-hook-form"
import type { DiaryValues } from "@/lib/validation"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { daysOfWeek } from "@/lib/utils"
import { hoursOfDays } from "@/types/diary"

interface ScheduleTabDiaryFormProps {
  control: Control<DiaryValues>
}

export function ScheduleTabDiaryForm({ control }: ScheduleTabDiaryFormProps) {
  const { fields } = useFieldArray({
    name: "daysAvailable",
    control,
  })

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-2">
          <FormField
            control={control}
            name={`daysAvailable.${index}.available`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>{daysOfWeek[index]}</FormLabel>
              </FormItem>
            )}
          />
          {field.available && (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`daysAvailable.${index}.timeStart`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de inicio</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona hora de inicio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hoursOfDays.map((hour) => (
                          <SelectItem key={hour} value={hour}>
                            {hour}
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
                name={`daysAvailable.${index}.timeEnd`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de fin</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona hora de fin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hoursOfDays.map((hour) => (
                          <SelectItem key={hour} value={hour}>
                            {hour}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

