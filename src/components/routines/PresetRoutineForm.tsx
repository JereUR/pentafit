"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

import { Form } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoadingButton from "@/components/LoadingButton"
import ErrorText from "@/components/ErrorText"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import { withClientSideRendering } from "@/hooks/withClientSideRendering"
import { type DailyExercisesValues, routineSchema, type RoutineValues } from "@/lib/validation"
import WorkingFacility from "../WorkingFacility"
import NoWorkingFacilityMessage from "../NoWorkingFacilityMessage"
import { GeneralInfoTabRoutineForm } from "./GeneralInfoTabRoutineForm"
import { ExercisesTabRoutineForm } from "./ExercisesTabRoutineForm"
import { useCreatePresetRoutineMutation, useUpdatePresetRoutineMutation } from "@/app/(main)/(authenticated)/entrenamiento/rutinas-preestablecidas/mutations"

interface RoutineFormProps {
  userId: string
  presetRoutineData?: RoutineValues & { id: string }
}

function PresetRoutineForm({ userId, presetRoutineData }: RoutineFormProps) {
  const { workingFacility } = useWorkingFacility()
  const [dailyExercises, setDailyExercises] = useState<DailyExercisesValues>(
    presetRoutineData?.dailyExercises || {
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
  const isEditing = !!presetRoutineData
  const router = useRouter()

  const { mutate: createPresetRoutine, isPending: isCreating, error: createError } = useCreatePresetRoutineMutation()
  const { mutate: updatePresetRoutine, isPending: isUpdating, error: updateError } = useUpdatePresetRoutineMutation()

  const form = useForm<RoutineValues>({
    resolver: zodResolver(routineSchema),
    defaultValues: presetRoutineData || {
      name: "",
      description: "",
      facilityId: workingFacility?.id || "",
      dailyExercises: {
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
    if (presetRoutineData) {
      form.reset(presetRoutineData)
      setDailyExercises(presetRoutineData.dailyExercises)
    }
  }, [presetRoutineData, form])

  useEffect(() => {
    if (workingFacility && !isEditing) {
      form.setValue("facilityId", workingFacility.id)
    }
  }, [workingFacility, form, isEditing])

  useEffect(() => {
    form.setValue("dailyExercises", dailyExercises)
  }, [dailyExercises, form])

  const onSubmit = async (values: RoutineValues) => {
    setError(undefined)

    const totalExercises = Object.values(dailyExercises).reduce((total, exercises) => total + exercises.length, 0)

    if (totalExercises === 0) {
      setError("Debe agregar al menos un ejercicio a la rutina preestablecida")
      return
    }

    const sanitizedValues: RoutineValues = {
      name: values.name,
      description: values.description || "",
      facilityId: values.facilityId || workingFacility?.id || "",
      dailyExercises: dailyExercises,
    }

    if (!sanitizedValues.name || !sanitizedValues.facilityId) {
      setError("Faltan campos requeridos (nombre o instalación)")
      return
    }

    if (isEditing && presetRoutineData) {
      updatePresetRoutine(
        {
          id: presetRoutineData.id,
          values: sanitizedValues,
        },
        {
          onSuccess: () => {
            form.reset()
            router.push("/entrenamiento/rutinas-preestablecidas")
          },
          onError: (error) => {
            console.error("Error completo:", error)
            setError(error instanceof Error ? error.message : "Error al actualizar la rutina preestablecida")
          },
        },
      )
    } else {
      createPresetRoutine(sanitizedValues, {
        onSuccess: () => {
          form.reset()
          router.push("/entrenamiento/rutinas-preestablecidas")
        },
        onError: (error: unknown) => {
          console.error("Error al crear la rutina preestablecida:", error)
          setError(error instanceof Error ? error.message : "Error desconocido al crear la rutina preestablecida")
        },
      })
    }
  }

  const mutationError = isEditing ? updateError : createError
  const isPending = isEditing ? isUpdating : isCreating
  const pageTitle = isEditing ? "Editar rutina preestablecida" : "Agregar rutina preestablecida"
  const pageDescription = isEditing ? "Modifica los datos de tu rutina preestablecida" : "Ingresa los datos de tu rutina preestablecida para comenzar"

  if (!workingFacility) {
    return (
      <div className="flex flex-col items-center gap-5 p-5 md:p-10 rounded-md border">
        <WorkingFacility userId={userId} />
        <NoWorkingFacilityMessage entityName="una rutina preestablecida" />
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
                  <TabsTrigger value="exercises">Ejercicios</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                  <GeneralInfoTabRoutineForm control={form.control} />
                </TabsContent>
                <TabsContent value="exercises">
                  <ExercisesTabRoutineForm dailyExercises={dailyExercises} setDailyExercises={setDailyExercises} />
                </TabsContent>
              </Tabs>
              <LoadingButton loading={isPending} type="submit" className="w-full">
                {isEditing ? "Actualizar rutina preestablecida" : "Crear rutina preestablecida"}
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default withClientSideRendering(PresetRoutineForm)

