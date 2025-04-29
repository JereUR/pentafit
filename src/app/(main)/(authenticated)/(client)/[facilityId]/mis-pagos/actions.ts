"use server"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { InvoiceData, PaymentData } from "@/types/clientPayments"

export async function getClientPayments(facilityId: string) {
  const { user } = await validateRequest()
  
  if (!user) {
    throw new Error("Usuario no autenticado")
  }

  const prismaPayments = await prisma.payment.findMany({
    where: {
      userId: user.id,
      plan: {
        facilityId: facilityId
      }
    },
    include: {
      plan: {
        include: {
          facility: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
              email: true,
              address: true,
              phone: true
            }
          }
        }
      },
      invoice: {
        select: {
          id: true,
          invoiceNumber: true
        }
      },
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      }
    },
    orderBy: {
      paymentDate: "desc",
    },
  })

  const payments: PaymentData[] = prismaPayments.map(payment => ({
    id: payment.id,
    amount: payment.amount,
    status: payment.status,
    paymentDate: payment.paymentDate,
    paymentMonth: payment.paymentMonth,
    transactionId: payment.transactionId,
    notes: payment.notes,
    plan: {
      id: payment.plan.id,
      name: payment.plan.name,
      price: payment.plan.price,
      planType: payment.plan.planType,
      facility: {
        id: payment.plan.facility.id,
        name: payment.plan.facility.name,
        logoUrl: payment.plan.facility.logoUrl,
        email: payment.plan.facility.email,
        address: payment.plan.facility.address,
        phone: payment.plan.facility.phone
      }
    },
    invoice: payment.invoice ? {
      id: payment.invoice.id,
      invoiceNumber: payment.invoice.invoiceNumber
    } : null,
    user: {
      id: payment.user.id,
      firstName: payment.user.firstName,
      lastName: payment.user.lastName,
      email: payment.user.email
    }
  }))

  return { payments }
}

export async function getClientInvoices(facilityId: string): Promise<{ invoices: InvoiceData[] }> {
  const { user } = await validateRequest()
  
  if (!user) {
    throw new Error("Usuario no autenticado")
  }

  const prismaInvoices = await prisma.invoice.findMany({
    where: {
      userId: user.id,
      plan: {
        facilityId: facilityId
      }
    },
    include: {
      plan: {
        select: {
          id: true,
          name: true,
          price: true,
          facility: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
              email: true,
              address: true,
              phone: true,
              instagram: true,
              facebook: true
            }
          }
        }
      },
      payment: {
        select: {
          id: true,
          status: true
        }
      },
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      }
    },
    orderBy: {
      issueDate: "desc",
    },
  })

  const invoices: InvoiceData[] = prismaInvoices.map(invoice => ({
    id: invoice.id,
    user: {
      id: invoice.user.id,
      firstName: invoice.user.firstName,
      lastName: invoice.user.lastName,
      email: invoice.user.email
    },
    plan: {
      id: invoice.plan.id,
      name: invoice.plan.name,
      price: invoice.plan.price 
    },
    payment: invoice.payment ? {
      id: invoice.payment.id,
      status: invoice.payment.status
    } : null,
    facility: {
      id: invoice.plan.facility.id,
      name: invoice.plan.facility.name,
      email: invoice.plan.facility.email,
      address: invoice.plan.facility.address,
      phone: invoice.plan.facility.phone,
      instagram: invoice.plan.facility.instagram,
      facebook: invoice.plan.facility.facebook,
      logoUrl: invoice.plan.facility.logoUrl
    },
    amount: invoice.amount,
    status: invoice.status,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    invoiceNumber: invoice.invoiceNumber,
    period: invoice.period,
    notes: invoice.notes
  }))

  return { invoices }
}