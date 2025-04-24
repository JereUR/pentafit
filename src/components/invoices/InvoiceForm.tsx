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
import { InvoiceValuesSchema, type InvoiceValues } from "@/lib/validation"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import NoWorkingFacilityMessage from "@/components/NoWorkingFacilityMessage"
import WorkingFacility from "@/components/WorkingFacility"
import { useCreateInvoiceMutation, useUpdateInvoiceMutation } from "@/app/(main)/(authenticated)/(admin)/facturacion/facturas/mutations"
import { GeneralInfoTabInvoiceForm } from "./GeneralInfoTabInvoiceForm"
import { DetailsTabInvoiceForm } from "./DetailsTabInvoiceForm"
import { withClientSideRendering } from "@/hooks/withClientSideRendering"
import { useAllClientsWithPlans } from "@/hooks/useAllClientsWithPlans"

interface InvoiceFormProps {
  userId: string
  invoiceData?: InvoiceValues & { id: string }
}

function InvoiceForm({ userId, invoiceData }: InvoiceFormProps) {
  const { workingFacility } = useWorkingFacility()
  const [error, setError] = useState<string>()
  const isEditing = !!invoiceData
  const router = useRouter()

  const { data: clients } = useAllClientsWithPlans(workingFacility?.id)

  const { mutate: createInvoice, isPending: isCreating, error: createError } = useCreateInvoiceMutation()
  const { mutate: updateInvoice, isPending: isUpdating, error: updateError } = useUpdateInvoiceMutation()

  const form = useForm<InvoiceValues>({
    resolver: zodResolver(InvoiceValuesSchema),
    defaultValues: invoiceData || {
      userId: "",
      planId: "",
      amount: 0,
      status: "PENDING",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      period: new Date().toISOString().slice(0, 7),
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

  const onSubmit = async (values: InvoiceValues) => {
    setError(undefined)

    if (isEditing && invoiceData) {
      updateInvoice(
        {
          id: invoiceData.id,
          values,
        },
        {
          onSuccess: () => {
            form.reset()
            router.push("/facturacion/facturas")
          },
          onError: (error) => {
            setError(error instanceof Error ? error.message : "Error updating invoice")
          },
        },
      )
    } else {
      createInvoice(values, {
        onSuccess: () => {
          form.reset()
          router.push("/facturacion/facturas")
        },
        onError: (error: unknown) => {
          console.error("Error creating invoice:", error)
          setError(error instanceof Error ? error.message : "Error desconocido al crear la factura")
        },
      })
    }
  }

  const mutationError = isEditing ? updateError : createError
  const isPending = isEditing ? isUpdating : isCreating
  const pageTitle = isEditing ? "Editar factura" : "Agregar factura"
  const pageDescription = isEditing ? "Modifica los datos de la factura" : "Ingresa los datos de la factura para comenzar"

  if (!workingFacility) {
    return (
      <div className="flex flex-col items-center gap-5 p-5 md:p-10 rounded-md border">
        <WorkingFacility userId={userId} />
        <NoWorkingFacilityMessage entityName="una factura" />
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
                  <GeneralInfoTabInvoiceForm control={form.control} />
                </TabsContent>
                <TabsContent value="details">
                  <DetailsTabInvoiceForm control={form.control} />
                </TabsContent>
              </Tabs>
              <LoadingButton loading={isPending} type="submit" className="w-full">
                {isEditing ? "Actualizar factura" : "Crear factura"}
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default withClientSideRendering(InvoiceForm)