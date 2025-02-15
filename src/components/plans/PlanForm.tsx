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
import { planSchema, type PlanValues } from "@/lib/validation"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import NoWorkingFacilityMessage from "../NoWorkingFacilityMessage"
import WorkingFacility from "../WorkingFacility"
import { useCreatePlanMutation, useUpdatePlanMutation } from "@/app/(main)/(authenticated)/planes/mutations"
import { GeneralInfoTabPlanForm } from "./GeneralInfoTabPlanForm"
import { DetailsTabPlanForm } from "./DetailsTabPlanForm"
import { PlanType } from "@prisma/client"
import { withClientSideRendering } from "@/hooks/withClientSideRendering"
import type { DiaryPlansValues } from "@/types/plan"

interface PlanFormProps {
  userId: string
  planData?: PlanValues & { id: string }
}

function PlanForm({ userId, planData }: PlanFormProps) {
  const { workingFacility } = useWorkingFacility()
  const [diaryPlanValues, setDiaryPlanValues] = useState<DiaryPlansValues[]>(planData?.diaryPlans || [])
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
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      expirationPeriod: 0,
      generateInvoice: false,
      paymentTypes: [],
      planType: PlanType.MENSUAL,
      freeTest: false,
      current: false,
      diaryPlans: [],
      facilityId: workingFacility?.id || "",
    },
  })

  useEffect(() => {
    if (planData) {
      form.reset(planData)
      setDiaryPlanValues(planData.diaryPlans)
    }
  }, [planData, form])

  useEffect(() => {
    if (workingFacility && !isEditing) {
      form.setValue("facilityId", workingFacility.id)
    }
  }, [workingFacility, form, isEditing])

  const onSubmit = async (values: PlanValues) => {
    console.log("Form submitted with values:", JSON.stringify(values, null, 2))
    setError(undefined)

    const sanitizedValues = {
      ...values,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      diaryPlans: diaryPlanValues.map(({ id, ...plan }) => { return plan }),
    }

    console.log("Sanitized values:", JSON.stringify(sanitizedValues, null, 2))

    if (isEditing && planData) {
      updatePlan(
        {
          id: planData.id,
          values: sanitizedValues,
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
      console.log("Sending data:", JSON.stringify(sanitizedValues, null, 2))
      createPlan(sanitizedValues, {
        onSuccess: () => {
          form.reset()
          router.push("/planes")
        },
        onError: (error: unknown) => {
          console.error("Error creating plan:", error)
          setError(error instanceof Error ? error.message : "Error desconocido al crear el plan")
        },
      })
    }
  }

  const mutationError = isEditing ? updateError : createError
  const isPending = isEditing ? isUpdating : isCreating
  const pageTitle = isEditing ? "Editar plan" : "Agregar plan"
  const pageDescription = isEditing ? "Modifica los datos de tu plan" : "Ingresa los datos de tu plan para comenzar"

  if (!workingFacility) {
    return (
      <div className="flex flex-col items-center gap-5 p-5 md:p-10 rounded-md border">
        <WorkingFacility userId={userId} />
        <NoWorkingFacilityMessage entityName="un plan" />
      </div>
    )
  }

  console.log({ diaryPlanValues })

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
                <TabsList className="grid w-full grid-cols-2">
                  {window.innerWidth > 700 ? (
                    <TabsTrigger value="general">Información General</TabsTrigger>
                  ) : (
                    <TabsTrigger value="general">Inf General</TabsTrigger>
                  )}
                  <TabsTrigger value="details">Detalles</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                  <GeneralInfoTabPlanForm control={form.control} />
                </TabsContent>
                <TabsContent value="details">
                  <DetailsTabPlanForm
                    control={form.control}
                    setDiaryPlanValues={setDiaryPlanValues}
                    initialDiaryPlans={planData?.diaryPlans}
                  />
                </TabsContent>
              </Tabs>
              <LoadingButton loading={isPending} type="submit" className="w-full">
                {isEditing ? "Actualizar plan" : "Crear plan"}
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default withClientSideRendering(PlanForm)

