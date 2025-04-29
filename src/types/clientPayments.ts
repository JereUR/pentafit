import { PaymentStatus, PlanType } from "@prisma/client"

export type PaymentData = {
  id: string
  amount: number
  status: PaymentStatus
  paymentDate: Date
  paymentMonth: string
  transactionId?: string | null
  notes?: string | null
  plan: {
    id: string
    name: string
    price: number
    planType: PlanType
    facility: {
      id: string
      name: string
      logoUrl?: string | null
      email?: string | null
      address?: string | null
      phone?: string | null
    }
  }
  invoice?: {
    id: string
    invoiceNumber: string
  } | null
  user: {
    id: string
    firstName: string
    lastName: string
    email?: string | null
  }
}

export interface InvoiceData {
  id: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string | null
  }
  plan: {
    id: string
    name: string
    price: number
  }
  payment: {
    id: string
    status: string
  } | null
  facility: {
    id: string
    name: string
    email: string | null
    address: string | null
    phone: string | null
    instagram: string | null
    facebook: string | null
    logoUrl: string | null
  }
  amount: number
  status: string
  issueDate: Date
  dueDate: Date
  invoiceNumber: string
  period: string
  notes: string | null
}

export const statusColorsInvoices = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  CANCELED: "bg-red-100 text-red-800",
  OVERDUE: "bg-orange-100 text-orange-800",
}

export const statusColorsPayments = {
  PENDING: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-purple-100 text-purple-800",
}