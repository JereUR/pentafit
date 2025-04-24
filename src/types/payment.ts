import { InvoiceStatus, PaymentStatus } from "@prisma/client"

export const columnsPayments: { key: keyof PaymentData; label: string }[] = [
  { key: "user", label: "Usuario" },
  { key: "plan", label: "Plan" },
  { key: "amount", label: "Monto" },
  { key: "status", label: "Estado" },
  { key: "paymentMonth", label: "Mes de Pago" },
  { key: "transactionId", label: "ID de Transacción" },
  { key: "notes", label: "Notas" },
  { key: "invoice", label: "Factura" },
]

export interface PaymentData {
  id: string
  user: { firstName: string; lastName: string }
  plan: { name: string }
  amount: number
  status: PaymentStatus
  paymentMonth: string
  transactionId: string | null
  notes: string | null
  invoice: { id: string; invoiceNumber: string; status: InvoiceStatus } | null
}

export interface PaymentDataExport {
  user: string
  plan: string
  amount: number
  status: string
  paymentMonth: string
  transactionId: string
  notes: string
  invoice: string
}

export interface PaymentActionResponse { 
  success: true
  payment: {
    id: string
    userId: string
    user: { firstName: string; lastName: string }
    planId: string
    plan: { name: string; generateInvoice: boolean }
    amount: number
    status: PaymentStatus
    paymentMonth: string
    transactionId: string | null
    notes: string | null
    invoice: { id: string; invoiceNumber: string; status: InvoiceStatus } | null
  }
  invoice: {
    id: string
    userId: string
    user: { firstName: string; lastName: string }
    planId: string
    plan: { name: string }
    paymentId: string
    amount: number
    status: InvoiceStatus
    invoiceNumber: string
    period: string
    notes: string | null
  } | null
}

export interface DeletedPaymentResponse {
  success: true
  deletedPayment: {
    id: string
    user: { firstName: string; lastName: string }
    plan: { name: string }
  }
}

export interface ErrorResponse {
  error: string
}

export function isPaymentActionResponse(result: PaymentActionResponse | ErrorResponse): result is PaymentActionResponse {
  return "success" in result
}

export function isDeletedPaymentResponse(result: DeletedPaymentResponse | ErrorResponse): result is DeletedPaymentResponse {
  return "success" in result
}