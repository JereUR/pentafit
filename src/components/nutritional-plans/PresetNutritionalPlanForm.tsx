"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Form } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoadingButton from "@/components/LoadingButton"
import ErrorText from "@/components/ErrorText"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import { withClientSideRendering } from "@/hooks/withClientSideRendering"
import { nutritionalPlanSchema, type NutritionalPlanValues, type DailyMealsValues, nutritionalPlanSubmitSchema } from "@/lib/validation"
import WorkingFacility from "../WorkingFacility"
import NoWorkingFacilityMessage from "../NoWorkingFacilityMessage"
import { GeneralInfoTabNutritionalPlanForm } from "./GeneralInfoTabNutritionalPlanForm"
import { MealsTabNutritionalPlanForm } from "./meals-tab/MealsTabNutritionalPlanForm"
import { PresetNutritionalPlanSelector } from "./PresetNutritionalPlanSelector"
import { useCreatePresetNutritionalPlanMutation, useUpdatePresetNutritionalPlanMutation } from "@/app/(main)/(authenticated)/entrenamiento/planes-nutricionales-preestablecidos/mutations"

interface PresetNutritionalPlanFormProps {
  userId: string
  presetNutritionalPlanData?: NutritionalPlanValues & { id: string }
}

function PresetNutritionalPlanForm({ userId, presetNutritionalPlanData }: PresetNutritionalPlanFormProps) {
  const { workingFacility } = useWorkingFacility()
  const [dailyMeals, setDailyMeals] = useState<DailyMealsValues>(
    presetNutritionalPlanData?.dailyMeals || {
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
      FRIDAY: [],
      SATURDAY: [],
      SUNDAY: [],
    },
  )
  const [error, setError] = useState<string>()
  const isEditing = !!presetNutritionalPlanData

  const {
    mutate: createPresetNutritionalPlan,
    isPending: isCreating,
    error: createError,
  } = useCreatePresetNutritionalPlanMutation()
  const {
    mutate: updatePresetNutritionalPlan,
    isPending: isUpdating,
    error: updateError,
  } = useUpdatePresetNutritionalPlanMutation()

  const form = useForm<NutritionalPlanValues>({
    resolver: zodResolver(nutritionalPlanSchema),
    defaultValues: presetNutritionalPlanData || {
      name: "",
      description: "",
      facilityId: workingFacility?.id || "",
      dailyMeals: {
        MONDAY: [],
        TUESDAY: [],
        WEDNESDAY: [],
        THURSDAY: [],
        FRIDAY: [],
        SATURDAY: [],
        SUNDAY: [],
      },
    },
  })

  useEffect(() => {
    if (presetNutritionalPlanData) {
      form.reset(presetNutritionalPlanData)
      setDailyMeals(presetNutritionalPlanData.dailyMeals)
    }
  }, [presetNutritionalPlanData, form])

  useEffect(() => {
    if (workingFacility && !isEditing) {
      form.setValue("facilityId", workingFacility.id)
    }
  }, [workingFacility, form, isEditing])

  useEffect(() => {
    form.setValue("dailyMeals", dailyMeals)
  }, [dailyMeals, form])

  const handleSelectPreset = (presetNutritionalPlan: NutritionalPlanValues) => {
    form.setValue("name", presetNutritionalPlan.name)
    form.setValue("description", presetNutritionalPlan.description || "")

    setDailyMeals(presetNutritionalPlan.dailyMeals)
  }

  const onSubmit = async (values: NutritionalPlanValues) => {
    setError(undefined)

    const sanitizedValues: NutritionalPlanValues = {
      name: values.name,
      description: values.description || "",
      facilityId: values.facilityId || workingFacility?.id || "",
      dailyMeals: dailyMeals,
    }

    if (!sanitizedValues.name || !sanitizedValues.facilityId) {
      setError("Faltan campos requeridos (nombre o instalación)")
      return
    }

    try {
      nutritionalPlanSubmitSchema.parse(sanitizedValues)
    } catch (err) {
      if (err && typeof err === "object" && "errors" in err) {
        const zodError = err as { errors: Array<{ path: string[]; message: string }> }

        if (zodError.errors?.some((e) => e.path.includes("dailyMeals"))) {
          setError("Cada comida debe tener al menos un alimento")
          return
        }

        setError("Error de validación: " + zodError.errors?.[0]?.message || "Verifique los datos ingresados")
      } else {
        setError("Error de validación: Verifique los datos ingresados")
      }
      return
    }

    if (isEditing && presetNutritionalPlanData) {
      updatePresetNutritionalPlan(
        {
          id: presetNutritionalPlanData.id,
          values: sanitizedValues,
        },
        {
          onSuccess: () => {
            form.reset()
          },
          onError: (error) => {
            console.error("Error completo:", error)
            setError(error instanceof Error ? error.message : "Error al actualizar el plan nutricional")
          },
        },
      )
    } else {
      createPresetNutritionalPlan(sanitizedValues, {
        onSuccess: () => {
          form.reset()
        },
        onError: (error) => {
          console.error("Error al crear el plan nutricional:", error)
          setError(error instanceof Error ? error.message : "Error desconocido al crear el plan nutricional")
        },
      })
    }
  }

  const mutationError = isEditing ? updateError : createError
  const isPending = isEditing ? isUpdating : isCreating
  const pageTitle = isEditing ? "Editar plan nutricional preestablecido" : "Agregar plan nutricional preestablecido"
  const pageDescription = isEditing
    ? "Modifica los datos de tu plan nutricional preestablecido"
    : "Ingresa los datos de tu plan nutricional preestablecido para comenzar"

  if (!workingFacility) {
    return (
      <div className="flex flex-col items-center gap-5 p-5 md:p-10 rounded-md border">
        <WorkingFacility userId={userId} />
        <NoWorkingFacilityMessage entityName="un plan nutricional preestablecido" />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center md:items-start gap-5 p-5 md:p-10 md:py-14 rounded-md border">
      {!isEditing && <WorkingFacility userId={userId} />}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{pageTitle}</CardTitle>
          <CardDescription>{pageDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <PresetNutritionalPlanSelector onSelectPreset={handleSelectPreset} />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {(mutationError || error) && (
                <ErrorText
                  errorText={
                    (mutationError instanceof Error
                      ? mutationError.message
                      : typeof mutationError === "string"
                        ? mutationError
                        : null) ||
                    error ||
                    "Ha ocurrido un error"
                  }
                />
              )}
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  {typeof window !== "undefined" && window.innerWidth > 700 ? (
                    <TabsTrigger value="general">Información General</TabsTrigger>
                  ) : (
                    <TabsTrigger value="general">Inf General</TabsTrigger>
                  )}
                  <TabsTrigger value="meals">Comidas</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                  <GeneralInfoTabNutritionalPlanForm control={form.control} />
                </TabsContent>
                <TabsContent value="meals">
                  <MealsTabNutritionalPlanForm dailyMeals={dailyMeals} setDailyMeals={setDailyMeals} />
                </TabsContent>
              </Tabs>
              <LoadingButton loading={isPending} type="submit" className="w-full">
                {isEditing ? "Actualizar plan nutricional preestablecido" : "Crear plan nutricional preestablecido"}
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default withClientSideRendering(PresetNutritionalPlanForm)

