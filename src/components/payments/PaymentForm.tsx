"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

import { Form } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoadingButton from "@/components/LoadingButton"
import ErrorText from "@/components/ErrorText"
import { PaymentValuesSchema, type PaymentValues } from "@/lib/validation"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import NoWorkingFacilityMessage from "@/components/NoWorkingFacilityMessage"
import WorkingFacility from "@/components/WorkingFacility"
import { useCreatePaymentMutation, useUpdatePaymentMutation } from "@/app/(main)/(authenticated)/(admin)/facturacion/pagos/mutations"
import { GeneralInfoTabPaymentForm } from "./GeneralInfoTabPaymentForm"
import { DetailsTabPaymentForm } from "./DetailsTabPaymentForm"
import { withClientSideRendering } from "@/hooks/withClientSideRendering"
import { useAllClientsWithPlans } from "@/hooks/useAllClientsWithPlans"

interface PaymentFormProps {
  userId: string
  paymentData?: PaymentValues & { id: string }
}

function PaymentForm({ userId, paymentData }: PaymentFormProps) {
  const { workingFacility } = useWorkingFacility()
  const [error, setError] = useState<string>()
  const isEditing = !!paymentData
  const router = useRouter()

  const { data: clients } = useAllClientsWithPlans(workingFacility?.id)

  const { mutate: createPayment, isPending: isCreating, error: createError } = useCreatePaymentMutation()
  const { mutate: updatePayment, isPending: isUpdating, error: updateError } = useUpdatePaymentMutation()

  const form = useForm<PaymentValues>({
    resolver: zodResolver(PaymentValuesSchema),
    defaultValues: paymentData || {
      userId: "",
      planId: "",
      amount: 0,
      status: "PENDING",
      paymentMonth: new Date().toISOString().slice(0, 7),
      transactionId: "",
      notes: "",
    },
  })

  useEffect(() => {
    const userId = form.getValues("userId")
    if (userId) {
      const client = clients?.find((c) => c.id === userId)
      if (client) {
        form.setValue("planId", client.plan.id)
        form.setValue("amount", client.plan.price)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("userId"), clients, form])

  const onSubmit = async (values: PaymentValues) => {
    setError(undefined)

    if (isEditing && paymentData) {
      updatePayment(
        {
          id: paymentData.id,
          values,
        },
        {
          onSuccess: () => {
            form.reset()
            router.push("/facturacion/pagos")
          },
          onError: (error) => {
            setError(error instanceof Error ? error.message : "Error updating payment")
          },
        },
      )
    } else {
      createPayment(values, {
        onSuccess: () => {
          form.reset()
          router.push("/facturacion/pagos")
        },
        onError: (error: unknown) => {
          console.error("Error creating payment:", error)
          setError(error instanceof Error ? error.message : "Error desconocido al crear el pago")
        },
      })
    }
  }

  const mutationError = isEditing ? updateError : createError
  const isPending = isEditing ? isUpdating : isCreating
  const pageTitle = isEditing ? "Editar pago" : "Agregar pago"
  const pageDescription = isEditing ? "Modifica los datos del pago" : "Ingresa los datos del pago para comenzar"

  if (!workingFacility) {
    return (
      <div className="flex flex-col items-center gap-5 p-5 md:p-10 rounded-md border">
        <WorkingFacility userId={userId} />
        <NoWorkingFacilityMessage entityName="un pago" />
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
                <TabsList className="grid w-full grid-cols-2">
                  {window.innerWidth > 700 ? (
                    <TabsTrigger value="general">Información General</TabsTrigger>
                  ) : (
                    <TabsTrigger value="general">Inf General</TabsTrigger>
                  )}
                  <TabsTrigger value="details">Detalles</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                  <GeneralInfoTabPaymentForm control={form.control} />
                </TabsContent>
                <TabsContent value="details">
                  <DetailsTabPaymentForm control={form.control} />
                </TabsContent>
              </Tabs>
              <LoadingButton loading={isPending} type="submit" className="w-full">
                {isEditing ? "Actualizar pago" : "Crear pago"}
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default withClientSideRendering(PaymentForm)