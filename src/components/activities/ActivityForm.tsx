"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

import { Form } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoadingButton from "@/components/LoadingButton"
import ErrorText from "@/components/ErrorText"
import { activitySchema, type ActivityValues } from "@/lib/validation"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import NoWorkingFacilityMessage from "../NoWorkingFacilityMessage"
import WorkingFacility from "../WorkingFacility"
import {
  useCreateActivityMutation,
  useUpdateActivityMutation,
} from "@/app/(main)/(authenticated)/actividades/mutations"
import { GeneralInfoTabActivityForm } from "./GeneralInfoTabActivityForm"
import { DetailsTabActivityForm } from "./DetailsTabActivityForm"
import { withClientSideRendering } from "@/hooks/withClientSideRendering"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { StaffTabActivityForm } from "./StaffTabActivityForm"

interface ActivityFormProps {
  userId: string
  activityData?: ActivityValues & { id: string; staffIds?: string[] }
}

function ActivityForm({ userId, activityData }: ActivityFormProps) {
  const { workingFacility } = useWorkingFacility()
  const [error, setError] = useState<string>()
  const isEditing = !!activityData
  const router = useRouter()
  const isDesktop = useMediaQuery("(min-width: 700px)")

  const { mutate: createActivity, isPending: isCreating, error: createError } = useCreateActivityMutation()
  const { mutate: updateActivity, isPending: isUpdating, error: updateError } = useUpdateActivityMutation()

  const form = useForm<ActivityValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: activityData || {
      name: "",
      description: "",
      price: 0,
      isPublic: false,
      publicName: "",
      generateInvoice: false,
      maxSessions: 1,
      mpAvailable: false,
      startDate: new Date(),
      endDate: new Date(),
      paymentType: "",
      activityType: "",
      facilityId: workingFacility?.id || "",
      staffIds: [],
    },
  })

  useEffect(() => {
    if (activityData) {
      form.reset(activityData)
    }
  }, [activityData, form])

  useEffect(() => {
    if (workingFacility && !isEditing) {
      form.setValue("facilityId", workingFacility.id)
    }
  }, [workingFacility, form, isEditing])

  async function onSubmit(values: ActivityValues) {

    try {
      const validatedData = activitySchema.parse(values)

      setError(undefined)

      if (isEditing && activityData) {
        updateActivity(
          {
            id: activityData.id,
            values: validatedData,
          },
          {
            onSuccess: () => {
              form.reset()
              router.push("/actividades")
            },
            onError: (error) => {
              console.error("Update error:", error)
              setError(error instanceof Error ? error.message : "Error al actualizar la actividad")
            },
          },
        )
      } else {
        createActivity(validatedData, {
          onSuccess: () => {
            form.reset()
          },
          onError: (error) => {
            console.error("Create error:", error)
            setError(error instanceof Error ? error.message : "Error al crear la actividad")
          },
        })
      }
    } catch (validationError) {
      console.error("Validation error:", validationError)
      if (validationError instanceof z.ZodError) {
        const errorMessages = validationError.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ")
        setError(`Error de validación: ${errorMessages}`)
      } else {
        setError("Error de validación desconocido")
      }
    }
  }

  const mutationError = isEditing ? updateError : createError
  const isPending = isEditing ? isUpdating : isCreating
  const pageTitle = isEditing ? "Editar actividad" : "Agregar actividad"
  const pageDescription = isEditing
    ? "Modifica los datos de tu actividad"
    : "Ingresa los datos de tu actividad para comenzar"

  if (!workingFacility) {
    return (
      <div className="flex flex-col items-center gap-5 p-5 md:p-10 rounded-md border">
        <WorkingFacility userId={userId} />
        <NoWorkingFacilityMessage entityName="una actividad" />
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
                    "An error occurred"
                  }
                />
              )}
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  {isDesktop ? (
                    <TabsTrigger value="general">Información General</TabsTrigger>
                  ) : (
                    <TabsTrigger value="general">Inf General</TabsTrigger>
                  )}
                  <TabsTrigger value="details">Detalles</TabsTrigger>
                  <TabsTrigger value="staff">Personal</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                  <GeneralInfoTabActivityForm control={form.control} />
                </TabsContent>
                <TabsContent value="details">
                  <DetailsTabActivityForm control={form.control} />
                </TabsContent>
                <TabsContent value="staff">
                  <StaffTabActivityForm control={form.control} facilityId={workingFacility.id} />
                </TabsContent>
              </Tabs>
              <LoadingButton loading={isPending} type="submit" className="w-full">
                {isEditing ? "Actualizar actividad" : "Crear actividad"}
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default withClientSideRendering(ActivityForm)

