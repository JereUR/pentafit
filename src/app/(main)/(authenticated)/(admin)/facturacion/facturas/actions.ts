"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { InvoiceStatus, type Prisma } from "@prisma/client"
import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"
import { InvoiceValues, InvoiceValuesSchema } from "@/lib/validation"
import { InvoiceResponse, DeletedInvoiceResponse, ErrorResponse } from "@/types/invoice"
import { createInvoiceTransaction } from "@/lib/transactionHelpers"

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
      if (!facility || !facility.facilityId) {
        console.error("Facility not found or invalid facilityId:", validatedValues.planId)
        throw new Error("Facility not found")
      }

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

      const transactionInput = {
        tx,
        type: "INVOICE_CREATED" as const,
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
      }

      await createInvoiceTransaction(transactionInput)

      /* const notificationInput = {
        tx,
        issuerId: authUser.id,
        facilityId: facility.facilityId,
        type: "INVOICE_CREATED" as NotificationType,
        relatedId: invoice.id,
      }

      await createNotification(notificationInput)

      const clientNotificationInput = {
        tx,
        recipientId: invoice.userId,
        issuerId: authUser.id,
        facilityId: facility.facilityId,
        type: "INVOICE_CREATED" as NotificationType,
        relatedId: invoice.id,
        entityName: `Factura ${invoice.invoiceNumber}`,
        startDate: invoice.issueDate,
      }

      await createClientNotification(clientNotificationInput) */

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
      console.error("Transaction error in createInvoice:", error, { input: values })
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
      if (!existingInvoice.plan.facilityId) {
        console.error("Invalid facilityId in existingInvoice:", existingInvoice)
        throw new Error("Facility not found")
      }

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

      const transactionInput = {
        tx,
        type: "INVOICE_UPDATED" as const,
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
      }
      
      await createInvoiceTransaction(transactionInput)

      /* const notificationInput = {
        tx,
        issuerId: authUser.id,
        facilityId: existingInvoice.plan.facilityId,
        type: "INVOICE_UPDATED" as NotificationType,
        relatedId: invoice.id,
      }
      
      await createNotification(notificationInput)

      const clientNotificationInput = {
        tx,
        recipientId: invoice.userId,
        issuerId: authUser.id,
        facilityId: existingInvoice.plan.facilityId,
        type: "INVOICE_UPDATED" as NotificationType,
        relatedId: invoice.id,
        entityName: `Factura ${invoice.invoiceNumber}`,
        changeDetails: Object.keys(validatedValues).map(
          (key) => `${key}: ${validatedValues[key as keyof typeof validatedValues]}`
        ),
      }
      
      await createClientNotification(clientNotificationInput) */

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
      console.error("Transaction error in updateInvoice:", error, { input: { id, values } })
      if (error instanceof z.ZodError) {
        return { error: "Invalid input data" }
      }
      return { error: "Error al actualizar la factura" }
    }
  })
}

export async function deleteInvoice(ids: string | string[]): Promise<DeletedInvoiceResponse[] | ErrorResponse> {
  const { user: authUser } = await validateRequest()
  if (!authUser) throw new Error("Usuario no autenticado")

  const invoiceIds = Array.isArray(ids) ? ids : [ids]

  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    try {
      const deletedInvoices: DeletedInvoiceResponse[] = []

      for (const id of invoiceIds) {
        const existingInvoice = await tx.invoice.findUnique({
          where: { id },
          include: {
            user: { select: { firstName: true, lastName: true } },
            plan: { select: { name: true, facilityId: true } },
          },
        })

        if (!existingInvoice) {
          throw new Error(`Factura con ID ${id} no encontrada`)
        }
        if (!existingInvoice.plan.facilityId) {
          console.error("Invalid facilityId in existingInvoice:", existingInvoice)
          throw new Error("Facility not found")
        }

        const deletedInvoice = await tx.invoice.delete({
          where: { id },
          include: {
            user: { select: { firstName: true, lastName: true } },
            plan: { select: { name: true } },
          },
        })

        const transactionInput = {
          tx,
          type: "INVOICE_DELETED" as const,
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
        }
        
        await createInvoiceTransaction(transactionInput)

        /* const notificationInput = {
          tx,
          issuerId: authUser.id,
          facilityId: existingInvoice.plan.facilityId,
          type: "INVOICE_DELETED" as NotificationType,
          relatedId: deletedInvoice.id,
        }
        
        await createNotification(notificationInput)

        const clientNotificationInput = {
          tx,
          recipientId: deletedInvoice.userId,
          issuerId: authUser.id,
          facilityId: existingInvoice.plan.facilityId,
          type: "INVOICE_DELETED" as NotificationType,
          relatedId: deletedInvoice.id,
          entityName: `Factura ${deletedInvoice.invoiceNumber}`,
          endDate: new Date(),
        }

        await createClientNotification(clientNotificationInput) */

        deletedInvoices.push({
          success: true,
          deletedInvoice: {
            id: deletedInvoice.id,
            user: deletedInvoice.user,
            plan: deletedInvoice.plan,
            invoiceNumber: deletedInvoice.invoiceNumber,
          },
        })
      }

      revalidatePath("/facturacion/facturas")
      return deletedInvoices
    } catch (error) {
      console.error("Transaction error in deleteInvoice:", error, { input: { invoiceIds } })
      if (error instanceof Error) {
        return { error: error.message }
      }
      return { error: "Error al eliminar las facturas" }
    }
  })
}