import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { useToast } from "@/hooks/use-toast"
import { PaymentValues } from "@/lib/validation"
import { createPayment, updatePayment, deletePayment } from "./actions"
import { PaymentActionResponse, DeletedPaymentResponse, isPaymentActionResponse, isDeletedPaymentResponse } from "@/types/payment"

export function useCreatePaymentMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation<PaymentActionResponse, Error, PaymentValues>({
    mutationFn: async (values: PaymentValues) => {
      const result = await createPayment(values)
      if (!isPaymentActionResponse(result)) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: ({ payment, invoice }) => {
      toast({
        title: "Pago creado correctamente",
        description: `Pago para ${payment.user.firstName} ${payment.user.lastName} registrado.${
          invoice ? ` Factura ${invoice.invoiceNumber} generada.` : ""
        }`,
      })
      queryClient.invalidateQueries({ queryKey: ["payments"] })
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
      router.push("/facturacion/pagos")
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al crear el pago",
        description: error.message,
      })
    },
  })
}

export function useUpdatePaymentMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation<PaymentActionResponse, Error, { id: string; values: Partial<PaymentValues> }>({
    mutationFn: async ({ id, values }) => {
      const result = await updatePayment(id, values)
      if (!isPaymentActionResponse(result)) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: ({ payment }) => {
      toast({
        title: "Pago actualizado correctamente",
        description: `Pago para ${payment.user.firstName} ${payment.user.lastName} actualizado.`,
      })
      queryClient.invalidateQueries({ queryKey: ["payments"] })
      queryClient.invalidateQueries({ queryKey: ["paymentDetails", payment.id] })
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al actualizar el pago",
        description: error.message,
      })
    },
  })
}

export function useDeletePaymentMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation<DeletedPaymentResponse, Error, string>({
    mutationFn: async (id: string) => {
      const result = await deletePayment(id)
      if (!isDeletedPaymentResponse(result)) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: ({ deletedPayment }) => {
      toast({
        title: "Pago eliminado correctamente",
        description: `Pago para ${deletedPayment.user.firstName} ${deletedPayment.user.lastName} eliminado.`,
      })
      queryClient.invalidateQueries({ queryKey: ["payments"] })
      router.push("/facturacion/pagos")
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al eliminar el pago",
        description: error.message,
      })
    },
  })
}