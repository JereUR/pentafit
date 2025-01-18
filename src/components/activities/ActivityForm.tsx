"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

import { Form } from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import LoadingButton from "@/components/LoadingButton"
import ErrorText from "@/components/ErrorText"
import { activitySchema, type ActivityValues } from "@/lib/validation"
import { GeneralInfoTabForm } from "./GeneralInfoTabForm"
import { DetailsTabForm } from "./DetailsTabForm"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import NoWorkingFacilityMessage from "../NoWorkingFacilityMessage"
import WorkingFacility from "../WorkingFacility"
import { useCreateActivityMutation, useUpdateActivityMutation } from "@/app/(main)/(authenticated)/actividades/mutations"

interface ActivityFormProps {
  userId: string
  activityData?: ActivityValues & { id: string }
}

export default function ActivityForm({ userId, activityData }: ActivityFormProps) {
  const { workingFacility } = useWorkingFacility()
  const [error, setError] = useState<string>()
  const router = useRouter()
  const isEditing = !!activityData

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
    },
  })

  useEffect(() => {
    if (activityData) {
      form.reset(activityData)
    }
  }, [activityData, form])

  async function onSubmit(values: ActivityValues) {
    setError(undefined)

    if (isEditing && activityData) {
      updateActivity(
        {
          id: activityData.id,
          values,
        },
        {
          onSuccess: () => {
            form.reset()
            router.push('/actividades')
          },
        }
      )
    } else {
      createActivity(
        values,
        {
          onSuccess: () => {
            form.reset()
            router.push('/actividades')
          },
        }
      )
    }
  }

  const mutationError = isEditing ? updateError : createError
  const isPending = isEditing ? isUpdating : isCreating
  const pageTitle = isEditing ? "Editar actividad" : "Agregar actividad"
  const pageDescription = isEditing
    ? "Modifica los datos de tu actividad"
    : "Ingresa los datos de tu actividad para comenzar"

  if (!workingFacility) {
    return <NoWorkingFacilityMessage entityName="una actividad" />
  }

  console.log({ workingFacility })

  return (
    <div className="flex flex-col items-center md:items-start gap-5 p-5 md:p-10 rounded-md border">
      <WorkingFacility userId={userId} />
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
                      : typeof mutationError === 'string'
                        ? mutationError
                        : null) ||
                    error ||
                    'An error occurred'
                  }
                />
              )}
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="general">Información General</TabsTrigger>
                  <TabsTrigger value="details">Detalles</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                  <GeneralInfoTabForm control={form.control} />
                </TabsContent>
                <TabsContent value="details">
                  <DetailsTabForm control={form.control} />
                </TabsContent>
              </Tabs>
              <LoadingButton
                loading={isPending}
                type="submit"
                className="w-full"
              >
                {isEditing ? "Actualizar actividad" : "Crear actividad"}
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
