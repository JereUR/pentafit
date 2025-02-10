'use client'

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
import { planSchema, type PlanValues } from "@/lib/validation"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import NoWorkingFacilityMessage from "../NoWorkingFacilityMessage"
import WorkingFacility from "../WorkingFacility"
import { useCreatePlanMutation, useUpdatePlanMutation } from "@/app/(main)/(authenticated)/planes/mutations"
import { GeneralInfoTabPlanForm } from "./GeneralInfoTabPlanForm"
import { DetailsTabPlanForm } from "./DetailsTabPlanForm"
import { PlanType } from "@prisma/client"

interface PlanFormProps {
  userId: string
  planData?: PlanValues & { id: string }
}

export default function PlanForm({ userId, planData }: PlanFormProps) {
  const { workingFacility } = useWorkingFacility()
  const [error, setError] = useState<string>()
  const isEditing = !!planData
  const router = useRouter()

  const { mutate: createPlan, isPending: isCreating, error: createError } = useCreatePlanMutation()
  const { mutate: updatePlan, isPending: isUpdating, error: updateError } = useUpdatePlanMutation()

  const form = useForm<PlanValues>({
    resolver: zodResolver(planSchema),
    defaultValues: planData || {
      name: "",
      description: "",
      price: 0,
      startDate: new Date(),
      endDate: new Date(),
      expirationPeriod: 0,
      generateInvoice: false,
      paymentTypes: [],
      planType: PlanType.MENSUAL,
      freeTest: false,
      current: false,
      diaryPlans: [
        {
          name: "Actividad 1",
          daysOfWeek: [true, true, true, true, true, false, false],
          sessionsPerWeek: 4,
          activityId: "52205e28-abab-4dfd-9920-7a4f6f8b8ed0",
        },
        {
          name: "Actividad 2",
          daysOfWeek: [false, false, false, false, false, true, true],
          sessionsPerWeek: 1,
          activityId: "52205e28-abab-4dfd-9920-7a4f6f8b8ed0",
        }
      ],
      facilityId: workingFacility?.id || "",
    },
  })

  useEffect(() => {
    if (planData) {
      form.reset(planData)
    }
  }, [planData, form])
  
  useEffect(() => {
    if (workingFacility && !isEditing) {
      form.setValue("facilityId", workingFacility.id)
    }
  }, [workingFacility, form, isEditing])

  async function onSubmit(values: PlanValues) {
    setError(undefined)

    if (isEditing && planData) {
      updatePlan(
        {
          id: planData.id,
          values,
        },
        {
          onSuccess: () => {
            form.reset()
            router.push("/planes")
          },
          onError: (error) => {
            setError(error instanceof Error ? error.message : "Error updating plan")
          },
        },
      )
    } else {
      createPlan(values, {
        onSuccess: () => {
          form.reset()
          router.push("/planes")
        },
        onError: (error) => {
          setError(error instanceof Error ? error.message : "Error creating plan")
        },
      })
    }
  }

  const mutationError = isEditing ? updateError : createError
  const isPending = isEditing ? isUpdating : isCreating
  const pageTitle = isEditing ? "Editar plan" : "Agregar plan"
  const pageDescription = isEditing
    ? "Modifica los datos de tu plan"
    : "Ingresa los datos de tu plan para comenzar"

  if (!workingFacility) {
    return <div className='flex flex-col items-center gap-5 p-5 md:p-10 rounded-md border'>
      <WorkingFacility userId={userId} />
      <NoWorkingFacilityMessage entityName="un plan" />
    </div>
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
                  {window.innerWidth > 700 ? <TabsTrigger value="general">Información General</TabsTrigger> : <TabsTrigger value="general">Inf General</TabsTrigger>}
                  <TabsTrigger value="details">Detalles</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                  <GeneralInfoTabPlanForm control={form.control} />
                </TabsContent>
                <TabsContent value="details">
                  <DetailsTabPlanForm control={form.control} />
                </TabsContent>
              </Tabs>
              <LoadingButton
                loading={isPending}
                type="submit"
                className="w-full"
              >
                {isEditing ? "Actualizar plan" : "Crear plan"}
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

