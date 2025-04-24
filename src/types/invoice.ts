import { InvoiceStatus } from "@prisma/client"

export const columnsInvoices: { key: keyof InvoiceData; label: string }[] = [
  { key: "invoiceNumber", label: "Número de Factura" },
  { key: "user", label: "Usuario" },
  { key: "plan", label: "Plan" },
  { key: "amount", label: "Monto" },
  { key: "status", label: "Estado" },
  { key: "issueDate", label: "Fecha de Emisión" },
  { key: "dueDate", label: "Fecha de Vencimiento" },
  { key: "period", label: "Período" },
  { key: "notes", label: "Notas" },
  { key: "payment", label: "Pago Asociado" },
]

export interface InvoiceData {
  id: string
  invoiceNumber: string
  user: { firstName: string; lastName: string }
  plan: { name: string }
  amount: number
  status: InvoiceStatus
  issueDate: Date
  dueDate: Date
  period: string
  notes: string | null
  payment: { id: string; amount: number; status: string } | null
}

export interface InvoiceDataExport {
  invoiceNumber: string
  user: string
  plan: string
  amount: number
  status: string
  issueDate: string
  dueDate: string
  period: string
  notes: string
  payment: string
}

export interface InvoiceResponse {
  success: true
  invoice: {
    id: string
    userId: string
    user: { firstName: string; lastName: string }
    planId: string
    plan: { name: string }
    paymentId: string | null
    amount: number
    status: InvoiceStatus
    issueDate: Date
    dueDate: Date
    invoiceNumber: string
    period: string
    notes: string | null
  }
}

export interface DeletedInvoiceResponse {
  success: true
  deletedInvoice: {
    id: string
    user: { firstName: string; lastName: string }
    plan: { name: string }
    invoiceNumber: string
  }
}

export interface ErrorResponse {
  error: string
}

export function isInvoiceResponse(result: InvoiceResponse | ErrorResponse): result is InvoiceResponse {
  return "success" in result
}

export function isDeletedInvoiceResponse(result: DeletedInvoiceResponse | ErrorResponse): result is DeletedInvoiceResponse {
  return "success" in result
}