"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { severityOptions, type UserHealthInfo } from "@/types/health"
import {
  chronicConditionSchema,
  medicationSchema,
  injurySchema,
  allergySchema,
  type ChronicConditionValues,
  type MedicationValues,
  type InjuryValues,
  type AllergyValues,
} from "@/lib/validation"
import { z } from "zod"
import { useUpdateHealthInfoMutation } from "./mutations"
import LoadingButton from "../LoadingButton"

interface HealthInfoFormProps {
  healthInfo?: UserHealthInfo
  userId: string
  facilityId: string
  onClose: () => void
  primaryColor?: string
}

const formSchema = z.object({
  hasChronicConditions: z.boolean(),
  chronicConditions: z.array(chronicConditionSchema).optional(),
  takingMedication: z.boolean(),
  medications: z.array(medicationSchema).optional(),
  hasInjuries: z.boolean(),
  injuries: z.array(injurySchema).optional(),
  hasAllergies: z.boolean(),
  allergies: z.array(allergySchema).optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  medicalNotes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function HealthInfoForm({ healthInfo, userId, facilityId, onClose, primaryColor }: HealthInfoFormProps) {
  const { mutate: updateHealthInfo, isPending } = useUpdateHealthInfoMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hasChronicConditions: healthInfo?.hasChronicConditions || false,
      chronicConditions: (healthInfo?.chronicConditions as ChronicConditionValues[]) || [],
      takingMedication: healthInfo?.takingMedication || false,
      medications: (healthInfo?.medications as MedicationValues[]) || [],
      hasInjuries: healthInfo?.hasInjuries || false,
      injuries: (healthInfo?.injuries as InjuryValues[]) || [],
      hasAllergies: healthInfo?.hasAllergies || false,
      allergies: (healthInfo?.allergies as AllergyValues[]) || [],
      emergencyContactName: healthInfo?.emergencyContactName || "",
      emergencyContactPhone: healthInfo?.emergencyContactPhone || "",
      emergencyContactRelation: healthInfo?.emergencyContactRelation || "",
      medicalNotes: healthInfo?.medicalNotes || "",
    },
  })

  const { watch } = form
  const hasChronicConditions = watch("hasChronicConditions")
  const takingMedication = watch("takingMedication")
  const hasInjuries = watch("hasInjuries")
  const hasAllergies = watch("hasAllergies")

  const onSubmit = async (values: FormValues) => {
    try {
      await updateHealthInfo({
        userId,
        facilityId,
        ...values,
      })
      onClose()
    } catch (error) {
      console.error("Error updating health info:", error)
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-background p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Información Médica</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contacto de Emergencia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="emergencyContactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del contacto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyContactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="Número de teléfono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="emergencyContactRelation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relación</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Familiar, Amigo, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Condiciones Crónicas</h3>
              <FormField
                control={form.control}
                name="hasChronicConditions"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormLabel>Tengo condiciones crónicas</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {hasChronicConditions && (
              <div className="space-y-4">
                {form.watch("chronicConditions")?.map((_, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Condición {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const currentConditions = form.getValues("chronicConditions") || []
                          form.setValue(
                            "chronicConditions",
                            currentConditions.filter((_, i) => i !== index),
                          )
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormField
                      control={form.control}
                      name={`chronicConditions.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de la condición</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Diabetes, Hipertensión" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`chronicConditions.${index}.diagnosisDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha de diagnóstico</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`chronicConditions.${index}.severity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Severidad</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar severidad" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {severityOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`chronicConditions.${index}.notes`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notas adicionales</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Información adicional relevante" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const currentConditions = form.getValues("chronicConditions") || []
                    form.setValue("chronicConditions", [
                      ...currentConditions,
                      { name: "", diagnosisDate: "", severity: "MILD", notes: "" },
                    ])
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Agregar Condición
                </Button>
              </div>
            )}
          </div>

          {/* Medications Section */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Medicamentos</h3>
              <FormField
                control={form.control}
                name="takingMedication"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormLabel>Tomo medicamentos</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {takingMedication && (
              <div className="space-y-4">
                {form.watch("medications")?.map((_, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Medicamento {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const currentMeds = form.getValues("medications") || []
                          form.setValue(
                            "medications",
                            currentMeds.filter((_, i) => i !== index),
                          )
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormField
                      control={form.control}
                      name={`medications.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del medicamento</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Paracetamol, Insulina" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`medications.${index}.dosage`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dosis</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: 500mg, 10ml" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`medications.${index}.frequency`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Frecuencia</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Cada 8 horas, Diario" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`medications.${index}.purpose`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Propósito</FormLabel>
                          <FormControl>
                            <Input placeholder="Para qué se toma este medicamento" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const currentMeds = form.getValues("medications") || []
                    form.setValue("medications", [...currentMeds, { name: "", dosage: "", frequency: "", purpose: "" }])
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Agregar Medicamento
                </Button>
              </div>
            )}
          </div>

          {/* Injuries Section */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Lesiones</h3>
              <FormField
                control={form.control}
                name="hasInjuries"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormLabel>Tengo lesiones</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {hasInjuries && (
              <div className="space-y-4">
                {form.watch("injuries")?.map((_, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Lesión {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const currentInjuries = form.getValues("injuries") || []
                          form.setValue(
                            "injuries",
                            currentInjuries.filter((_, i) => i !== index),
                          )
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`injuries.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de lesión</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Esguince, Fractura" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`injuries.${index}.bodyPart`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parte del cuerpo</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Rodilla, Espalda" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`injuries.${index}.dateOccurred`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha de la lesión</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`injuries.${index}.severity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Severidad</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar severidad" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {severityOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`injuries.${index}.affectsExercise`}
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormLabel>Afecta al ejercicio</FormLabel>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {form.watch(`injuries.${index}.affectsExercise`) && (
                      <FormField
                        control={form.control}
                        name={`injuries.${index}.exerciseRestrictions`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Restricciones de ejercicio</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Describe las limitaciones para el ejercicio" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const currentInjuries = form.getValues("injuries") || []
                    form.setValue("injuries", [
                      ...currentInjuries,
                      {
                        name: "",
                        bodyPart: "",
                        dateOccurred: "",
                        affectsExercise: false,
                        exerciseRestrictions: "",
                        severity: "MILD",
                      },
                    ])
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Agregar Lesión
                </Button>
              </div>
            )}
          </div>

          {/* Allergies Section */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Alergias</h3>
              <FormField
                control={form.control}
                name="hasAllergies"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormLabel>Tengo alergias</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {hasAllergies && (
              <div className="space-y-4">
                {form.watch("allergies")?.map((_, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Alergia {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const currentAllergies = form.getValues("allergies") || []
                          form.setValue(
                            "allergies",
                            currentAllergies.filter((_, i) => i !== index),
                          )
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormField
                      control={form.control}
                      name={`allergies.${index}.allergen`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alérgeno</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Maní, Lactosa, Gluten" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`allergies.${index}.reaction`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reacción</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Urticaria, Dificultad para respirar" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`allergies.${index}.severity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Severidad</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar severidad" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {severityOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const currentAllergies = form.getValues("allergies") || []
                    form.setValue("allergies", [...currentAllergies, { allergen: "", reaction: "", severity: "MILD" }])
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Agregar Alergia
                </Button>
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">Notas Adicionales</h3>
            <FormField
              control={form.control}
              name="medicalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Información médica adicional</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Cualquier otra información médica relevante que los entrenadores deban conocer"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="pt-6 space-x-2 flex justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <LoadingButton loading={isPending} type="submit" style={{ backgroundColor: primaryColor }}>
              Guardar
            </LoadingButton>
          </div>
        </form>
      </Form>
    </div>
  )
}
