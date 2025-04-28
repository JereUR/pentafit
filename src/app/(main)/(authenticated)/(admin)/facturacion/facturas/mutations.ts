import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { useToast } from "@/hooks/use-toast"
import { InvoiceValues } from "@/lib/validation"
import { createInvoice, updateInvoice, deleteInvoice } from "./actions"
import { InvoiceResponse, DeletedInvoiceResponse, isInvoiceResponse, isDeletedInvoiceResponse } from "@/types/invoice"

export function useCreateInvoiceMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation<InvoiceResponse, Error, InvoiceValues>({
    mutationFn: async (values: InvoiceValues) => {
      const result = await createInvoice(values)
      if (!isInvoiceResponse(result)) {
              throw new Error(result.error)
            }
            return result
    },
    onSuccess: ({ invoice }) => {
      toast({
        title: "Factura creada correctamente",
        description: `Factura ${invoice.invoiceNumber} para ${invoice.user.firstName} ${invoice.user.lastName} registrada.`,
      })
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
      router.push("/facturacion/facturas")
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al crear la factura",
        description: error.message,
      })
    },
  })
}

export function useUpdateInvoiceMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation<InvoiceResponse, Error, { id: string; values: Partial<InvoiceValues> }>({
    mutationFn: async ({ id, values }) => {
      const result = await updateInvoice(id, values)
      if (!isInvoiceResponse(result)) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: ({ invoice }) => {
      toast({
        title: "Factura actualizada correctamente",
        description: `Factura ${invoice.invoiceNumber} actualizada.`,
      })
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
      queryClient.invalidateQueries({ queryKey: ["invoiceDetails", invoice.id] })
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al actualizar la factura",
        description: error.message,
      })
    },
  })
}

export function useDeleteInvoiceMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation<DeletedInvoiceResponse[], Error, string | string[]>({
    mutationFn: async (ids: string | string[]) => {
      const result = await deleteInvoice(ids)
      if (!isDeletedInvoiceResponse(result)) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: (deletedInvoices) => {
      const message = deletedInvoices.length > 1
        ? `Se eliminaron ${deletedInvoices.length} facturas correctamente.`
        : `Factura ${deletedInvoices[0].deletedInvoice.invoiceNumber} eliminada.`

      toast({
        title: deletedInvoices.length > 1 ? "Facturas eliminadas correctamente" : "Factura eliminada correctamente",
        description: message,
      })
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
      router.push("/facturacion/facturas")
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al eliminar la(s) factura(s)",
        description: error.message,
      })
    },
  })
}