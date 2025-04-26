"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { InvoiceStatus, type Prisma } from "@prisma/client"
import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"
import { InvoiceValues, InvoiceValuesSchema } from "@/lib/validation"
import { createNotification} from "@/lib/notificationHelpers"
import { createInvoiceTransaction } from "@/lib/transactionHelpers"
import { InvoiceResponse, DeletedInvoiceResponse, ErrorResponse } from "@/types/invoice"
/* import { createClientNotification } from "@/lib/clientNotificationHelpers" */

export async function getInvoiceById(id: string): Promise<(InvoiceValues & { id: string }) | null> {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        planId: true,
        amount: true,
        status: true,
        dueDate: true,
        period: true,
        notes: true,
      },
    })

    if (!invoice) return null

    return {
      id: invoice.id,
      userId: invoice.userId,
      planId: invoice.planId,
      amount: invoice.amount,
      status: invoice.status,
      dueDate: invoice.dueDate.toISOString(),
      period: invoice.period,
      notes: invoice.notes ?? undefined,
    }
  } catch (error) {
    console.error("Error fetching invoice:", error)
    return null
  }
}

async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const count = await prisma.invoice.count({ where: { invoiceNumber: { startsWith: `FAC-${year}-` } } })
  return `FAC-${year}-${String(count + 1).padStart(3, "0")}`
}

export async function createInvoice(values: InvoiceValues): Promise<InvoiceResponse | ErrorResponse> {
  const { user: authUser } = await validateRequest()
  if (!authUser) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    try {
      const validatedValues = InvoiceValuesSchema.parse(values)

      const user = await tx.user.findUnique({ where: { id: validatedValues.userId } })
      if (!user) throw new Error("User not found")
      const plan = await tx.plan.findUnique({ where: { id: validatedValues.planId } })
      if (!plan) throw new Error("Plan not found")
      const facility = await tx.plan.findUnique({ where: { id: validatedValues.planId }, select: { facilityId: true } })
      if (!facility) throw new Error("Facility not found")

      const invoice = await tx.invoice.create({
        data: {
          userId: validatedValues.userId,
          planId: validatedValues.planId,
          amount: validatedValues.amount,
          status: validatedValues.status as InvoiceStatus,
          dueDate: validatedValues.dueDate,
          invoiceNumber: await generateInvoiceNumber(),
          period: validatedValues.period,
          notes: validatedValues.notes,
        },
        include: {
          user: { select: { firstName: true, lastName: true } },
          plan: { select: { name: true } },
        },
      })

      await createInvoiceTransaction({
        tx,
        type: "INVOICE_CREATED",
        invoiceId: invoice.id,
        performedById: authUser.id,
        facilityId: facility.facilityId,
        details: {
          action: "Factura creada",
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          userId: invoice.userId,
          userName: `${invoice.user.firstName} ${invoice.user.lastName}`,
          planId: invoice.planId,
          planName: invoice.plan.name,
          amount: invoice.amount,
          status: invoice.status,
          dueDate: invoice.dueDate.toISOString(),
          period: invoice.period,
        },
      })

      await createNotification({
        tx,
        issuerId: authUser.id,
        facilityId: facility.facilityId,
        type: "INVOICE_CREATED",
        relatedId: invoice.id,
      })

     /*  await createClientNotification({
        tx,
        recipientId: invoice.userId,
        issuerId: authUser.id,
        facilityId: facility.facilityId,
        type: "INVOICE_CREATED",
        relatedId: invoice.id,
        entityName: `Factura ${invoice.invoiceNumber}`,
        startDate: invoice.issueDate,
      }) */

      revalidatePath("/facturacion/facturas")
      return {
        success: true as const,
        invoice: {
          id: invoice.id,
          userId: invoice.userId,
          user: invoice.user,
          planId: invoice.planId,
          plan: invoice.plan,
          paymentId: invoice.paymentId ?? null,
          amount: invoice.amount,
          status: invoice.status,
          issueDate: invoice.issueDate,
          dueDate: invoice.dueDate,
          invoiceNumber: invoice.invoiceNumber,
          period: invoice.period,
          notes: invoice.notes ?? null,
        },
      } satisfies InvoiceResponse
    } catch (error) {
      console.error("Error creating invoice:", error)
      if (error instanceof z.ZodError) {
        return { error: "Invalid input data" }
      }
      return { error: "Error al crear la factura" }
    }
  })
}

export async function updateInvoice(id: string, values: Partial<InvoiceValues>): Promise<InvoiceResponse | ErrorResponse> {
  const { user: authUser } = await validateRequest()
  if (!authUser) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    try {
      const validatedValues = InvoiceValuesSchema.partial().parse(values)

      const existingInvoice = await tx.invoice.findUnique({
        where: { id },
        include: {
          user: { select: { firstName: true, lastName: true } },
          plan: { select: { name: true, facilityId: true } },
        },
      })
      if (!existingInvoice) throw new Error("Invoice not found")

      const invoice = await tx.invoice.update({
        where: { id },
        data: {
          userId: validatedValues.userId,
          planId: validatedValues.planId,
          amount: validatedValues.amount,
          status: validatedValues.status as InvoiceStatus,
          dueDate: validatedValues.dueDate,
          period: validatedValues.period,
          notes: validatedValues.notes,
        },
        include: {
          user: { select: { firstName: true, lastName: true } },
          plan: { select: { name: true } },
        },
      })

      await createInvoiceTransaction({
        tx,
        type: "INVOICE_UPDATED",
        invoiceId: invoice.id,
        performedById: authUser.id,
        facilityId: existingInvoice.plan.facilityId,
        details: {
          action: "Factura actualizada",
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          userId: invoice.userId,
          userName: `${invoice.user.firstName} ${invoice.user.lastName}`,
          planId: invoice.planId,
          planName: invoice.plan.name,
          amount: invoice.amount,
          status: invoice.status,
          dueDate: invoice.dueDate.toISOString(),
          period: invoice.period,
          updatedFields: Object.keys(validatedValues),
        },
      })

      await createNotification({
        tx,
        issuerId: authUser.id,
        facilityId: existingInvoice.plan.facilityId,
        type: "INVOICE_UPDATED",
        relatedId: invoice.id,
      })

      /* await createClientNotification({
        tx,
        recipientId: invoice.userId,
        issuerId: authUser.id,
        facilityId: existingInvoice.plan.facilityId,
        type: "INVOICE_UPDATED",
        relatedId: invoice.id,
        entityName: `Factura ${invoice.invoiceNumber}`,
        changeDetails: Object.keys(validatedValues).map(
          (key) => `${key}: ${validatedValues[key as keyof typeof validatedValues]}`
        ),
      }) */

      revalidatePath("/facturacion/facturas")
      return {
        success: true as const,
        invoice: {
          id: invoice.id,
          userId: invoice.userId,
          user: invoice.user,
          planId: invoice.planId,
          plan: invoice.plan,
          paymentId: invoice.paymentId ?? null,
          amount: invoice.amount,
          status: invoice.status,
          issueDate: invoice.issueDate,
          dueDate: invoice.dueDate,
          invoiceNumber: invoice.invoiceNumber,
          period: invoice.period,
          notes: invoice.notes ?? null,
        },
      } satisfies InvoiceResponse
    } catch (error) {
      console.error("Error updating invoice:", error)
      if (error instanceof z.ZodError) {
        return { error: "Invalid input data" }
      }
      return { error: "Error al actualizar la factura" }
    }
  })
}

export async function deleteInvoice(id: string): Promise<DeletedInvoiceResponse | ErrorResponse> {
  const { user: authUser } = await validateRequest()
  if (!authUser) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    try {
      const existingInvoice = await tx.invoice.findUnique({
        where: { id },
        include: {
          user: { select: { firstName: true, lastName: true } },
          plan: { select: { name: true, facilityId: true } },
        },
      })
      if (!existingInvoice) throw new Error("Factura no encontrada")

      const deletedInvoice = await tx.invoice.delete({
        where: { id },
        include: {
          user: { select: { firstName: true, lastName: true } },
          plan: { select: { name: true } },
        },
      })

      await createInvoiceTransaction({
        tx,
        type: "INVOICE_DELETED",
        invoiceId: deletedInvoice.id,
        performedById: authUser.id,
        facilityId: existingInvoice.plan.facilityId,
        details: {
          action: "Factura eliminada",
          invoiceId: deletedInvoice.id,
          invoiceNumber: deletedInvoice.invoiceNumber,
          userId: deletedInvoice.userId,
          userName: `${deletedInvoice.user.firstName} ${deletedInvoice.user.lastName}`,
          planId: deletedInvoice.planId,
          planName: deletedInvoice.plan.name,
        },
      })

      await createNotification({
        tx,
        issuerId: authUser.id,
        facilityId: existingInvoice.plan.facilityId,
        type: "INVOICE_DELETED",
        relatedId: deletedInvoice.id,
      })

      /* await createClientNotification({
        tx,
        recipientId: deletedInvoice.userId,
        issuerId: authUser.id,
        facilityId: existingInvoice.plan.facilityId,
        type: "INVOICE_DELETED",
        relatedId: deletedInvoice.id,
        entityName: `Factura ${deletedInvoice.invoiceNumber}`,
        endDate: new Date(),
      }) */

      revalidatePath("/facturacion/facturas")
      return {
        success: true as const,
        deletedInvoice: {
          id: deletedInvoice.id,
          user: deletedInvoice.user,
          plan: deletedInvoice.plan,
          invoiceNumber: deletedInvoice.invoiceNumber,
        },
      } satisfies DeletedInvoiceResponse
    } catch (error) {
      console.error("Error deleting invoice:", error)
      if (error instanceof Error) {
        return { error: error.message }
      }
      return { error: "Error al eliminar la factura" }
    }
  })
}