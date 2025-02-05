"use client"

import { type Control, useWatch } from "react-hook-form"

import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { DiaryValues } from "@/lib/validation"
import { hoursOfDays } from "@/types/diary"
import { daysOfWeekFull } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

interface ScheduleTabDiaryFormProps {
  control: Control<DiaryValues>
}

export function ScheduleTabDiaryForm({ control }: ScheduleTabDiaryFormProps) {
  const daysAvailable = useWatch({
    control,
    name: "daysAvailable",
  })

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="repeatFor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repetir por (semanas)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number.parseInt(e.target.value) : null)}
                    value={field.value ?? ""}
                    placeholder="Número de semanas"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="worksHolidays"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Trabaja en feriados</FormLabel>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-6 bg-secondary/20 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Configuración de días</h3>

          <Card className="border-primary/20">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <div className="grid grid-cols-7 gap-4">
                    {daysOfWeekFull.map((day) => (
                      <div key={day} className="flex flex-col items-center">
                        <FormLabel className="mb-1 text-center">{day}</FormLabel>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">Días de oferta</h4>
                  <div className="grid grid-cols-7 gap-4">
                    {daysOfWeekFull.map((day, index) => (
                      <FormField
                        key={`offer-${day}`}
                        control={control}
                        name={`offerDays.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-center">
                            <FormControl>
                              <div className="space-y-2">
                                <Switch
                                  checked={field.value.isOffer}
                                  onCheckedChange={(checked) => field.onChange({ ...field.value, isOffer: checked })}
                                  className="data-[state=checked]:bg-primary"
                                />
                                {field.value.isOffer && (
                                  <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={field.value.discountPercentage || ""}
                                    onChange={(e) =>
                                      field.onChange({
                                        ...field.value,
                                        discountPercentage: e.target.value ? Number(e.target.value) : null,
                                      })
                                    }
                                    className="w-16 text-center"
                                    placeholder="%"
                                  />
                                )}
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">Días Disponibles</h4>
                  <div className="grid grid-cols-7 gap-4">
                    {daysOfWeekFull.map((day, index) => (
                      <FormField
                        key={`available-${day}`}
                        control={control}
                        name={`daysAvailable.${index}.available`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-center">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-6 w-6" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Horarios por día</h3>
          {daysAvailable.map(
            (day, index) =>
              day.available && (
                <Card key={index} className="border-primary/20">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">{daysOfWeekFull[index]}</h4>
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
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ),
          )}
        </div>
      </CardContent>
    </Card>
  )
}

