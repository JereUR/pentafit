"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { PaymentStatus, InvoiceStatus, type Prisma } from "@prisma/client"
import { validateRequest } from "@/auth"
import { PaymentValues, PaymentValuesSchema } from "@/lib/validation"
import { createNotification} from "@/lib/notificationHelpers"
import { createPaymentTransaction } from "@/lib/transactionHelpers"
import { PaymentActionResponse, DeletedPaymentResponse, ErrorResponse } from "@/types/payment"
/* import { createClientNotification } from "@/lib/clientNotificationHelpers" */

export async function getPaymentById(id: string): Promise<(PaymentValues & { id: string }) | null> {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        planId: true,
        amount: true,
        status: true,
        paymentMonth: true,
        transactionId: true,
        notes: true,
      },
    })

    if (!payment) return null

    return {
      id: payment.id,
      userId: payment.userId,
      planId: payment.planId,
      amount: payment.amount,
      status: payment.status,
      paymentMonth: payment.paymentMonth,
      transactionId: payment.transactionId ?? undefined,
      notes: payment.notes ?? undefined,
    }
  } catch (error) {
    console.error("Error fetching payment:", error)
    return null
  }
}

async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const count = await prisma.invoice.count({ where: { invoiceNumber: { startsWith: `FAC-${year}-` } } })
  return `FAC-${year}-${String(count + 1).padStart(3, "0")}`
}

export async function createPayment(values: PaymentValues): Promise<PaymentActionResponse | ErrorResponse> {
  const { user: authUser } = await validateRequest()
  if (!authUser) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    try {
      const validatedValues = PaymentValuesSchema.parse(values)

      const user = await tx.user.findUnique({ where: { id: validatedValues.userId } })
      if (!user) throw new Error("User not found")
      const plan = await tx.plan.findUnique({ where: { id: validatedValues.planId } })
      if (!plan) throw new Error("Plan not found")
      const facility = await tx.plan.findUnique({ where: { id: validatedValues.planId }, select: { facilityId: true } })
      if (!facility) throw new Error("Facility not found")

      const payment = await tx.payment.create({
        data: {
          userId: validatedValues.userId,
          planId: validatedValues.planId,
          amount: validatedValues.amount,
          status: validatedValues.status as PaymentStatus,
          paymentMonth: validatedValues.paymentMonth,
          transactionId: validatedValues.transactionId,
          notes: validatedValues.notes,
        },
        include: {
          user: { select: { firstName: true, lastName: true } },
          plan: { select: { name: true, generateInvoice: true } },
        },
      })

      let invoice = null
      if (plan.generateInvoice) {
        const dueDate = new Date()
        dueDate.setDate(dueDate.getDate() + 7)
        invoice = await tx.invoice.create({
          data: {
            userId: validatedValues.userId,
            planId: validatedValues.planId,
            paymentId: payment.id,
            amount: validatedValues.amount,
            status: validatedValues.status === "COMPLETED" ? InvoiceStatus.PAID : InvoiceStatus.PENDING,
            dueDate,
            invoiceNumber: await generateInvoiceNumber(),
            period: validatedValues.paymentMonth,
            notes: validatedValues.notes,
          },
          include: {
            user: { select: { firstName: true, lastName: true } },
            plan: { select: { name: true } },
          },
        })
      }

      await createPaymentTransaction({
        tx,
        type: "PAYMENT_CREATED",
        paymentId: payment.id,
        performedById: authUser.id,
        facilityId: facility.facilityId,
        details: {
          action: "Pago creado",
          paymentId: payment.id,
          userId: payment.userId,
          userName: `${payment.user.firstName} ${payment.user.lastName}`,
          planId: payment.planId,
          planName: payment.plan.name,
          amount: payment.amount,
          status: payment.status,
          paymentMonth: payment.paymentMonth,
          transactionId: payment.transactionId,
          invoiceId: invoice?.id,
          invoiceNumber: invoice?.invoiceNumber,
        },
      })

      await createNotification({
        tx,
        issuerId: authUser.id,
        facilityId: facility.facilityId,
        type: "PAYMENT_CREATED",
        relatedId: payment.id,
      })

      /* await createClientNotification({
        tx,
        recipientId: payment.userId,
        issuerId: authUser.id,
        facilityId: facility.facilityId,
        type: "PAYMENT_CREATED",
        relatedId: payment.id,
        entityName: `Pago para ${payment.plan.name}`,
        startDate: payment.paymentDate,
      }) */ 

      revalidatePath("/facturacion/pagos")
      revalidatePath("/facturacion/facturas")
      return {
        success: true as const,
        payment: {
          id: payment.id,
          userId: payment.userId,
          user: payment.user,
          planId: payment.planId,
          plan: payment.plan,
          amount: payment.amount,
          status: payment.status,
          paymentMonth: payment.paymentMonth,
          transactionId: payment.transactionId ?? null,
          notes: payment.notes ?? null,
          invoice: invoice ? { id: invoice.id, invoiceNumber: invoice.invoiceNumber, status: invoice.status } : null,
        },
        invoice: invoice
          ? {
              id: invoice.id,
              userId: invoice.userId,
              user: invoice.user,
              planId: invoice.planId,
              plan: invoice.plan,
              paymentId: invoice.paymentId!,
              amount: invoice.amount,
              status: invoice.status,
              invoiceNumber: invoice.invoiceNumber,
              period: invoice.period,
              notes: invoice.notes ?? null,
            }
          : null,
      } satisfies PaymentActionResponse
    } catch (error) {
      console.error("Error creating payment:", error)
      if (error instanceof z.ZodError) {
        return { error: "Invalid input data" }
      }
      return { error: "Error al crear el pago" }
    }
  })
}

export async function updatePayment(id: string, values: Partial<PaymentValues>): Promise<PaymentActionResponse | ErrorResponse> {
  const { user: authUser } = await validateRequest()
  if (!authUser) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    try {
      const validatedValues = PaymentValuesSchema.partial().parse(values)

      const existingPayment = await tx.payment.findUnique({
        where: { id },
        include: {
          user: { select: { firstName: true, lastName: true } },
          plan: { select: { name: true, facilityId: true } },
        },
      })
      if (!existingPayment) throw new Error("Payment not found")

      const payment = await tx.payment.update({
        where: { id },
        data: {
          userId: validatedValues.userId,
          planId: validatedValues.planId,
          amount: validatedValues.amount,
          status: validatedValues.status as PaymentStatus,
          paymentMonth: validatedValues.paymentMonth,
          transactionId: validatedValues.transactionId,
          notes: validatedValues.notes,
        },
        include: {
          user: { select: { firstName: true, lastName: true } },
          plan: { select: { name: true, generateInvoice: true } },
          invoice: { select: { id: true, invoiceNumber: true, status: true, userId: true, planId: true, amount: true, period: true, notes: true } },
        },
      })

      if (payment.invoice && validatedValues.status) {
        await tx.invoice.update({
          where: { id: payment.invoice.id },
          data: {
            status: validatedValues.status === "COMPLETED" ? InvoiceStatus.PAID : InvoiceStatus.PENDING,
          },
        })
      }

      await createPaymentTransaction({
        tx,
        type: "PAYMENT_UPDATED",
        paymentId: payment.id,
        performedById: authUser.id,
        facilityId: existingPayment.plan.facilityId,
        details: {
          action: "Pago actualizado",
          paymentId: payment.id,
          userId: payment.userId,
          userName: `${payment.user.firstName} ${payment.user.lastName}`,
          planId: payment.planId,
          planName: payment.plan.name,
          amount: payment.amount,
          status: payment.status,
          paymentMonth: payment.paymentMonth,
          transactionId: payment.transactionId,
          invoiceId: payment.invoice?.id,
          invoiceNumber: payment.invoice?.invoiceNumber,
          updatedFields: Object.keys(validatedValues),
        },
      })

      await createNotification({
        tx,
        issuerId: authUser.id,
        facilityId: existingPayment.plan.facilityId,
        type: "PAYMENT_UPDATED",
        relatedId: payment.id,
      })

      /* await createClientNotification({
        tx,
        recipientId: payment.userId,
        issuerId: authUser.id,
        facilityId: existingPayment.plan.facilityId,
        type: "PAYMENT_UPDATED",
        relatedId: payment.id,
        entityName: `Pago para ${payment.plan.name}`,
        changeDetails: Object.keys(validatedValues).map(
          (key) => `${key}: ${validatedValues[key as keyof typeof validatedValues]}`
        ),
      }) */

      revalidatePath("/facturacion/pagos")
      revalidatePath("/facturacion/facturas")
      return {
        success: true as const,
        payment: {
          id: payment.id,
          userId: payment.userId,
          user: payment.user,
          planId: payment.planId,
          plan: payment.plan,
          amount: payment.amount,
          status: payment.status,
          paymentMonth: payment.paymentMonth,
          transactionId: payment.transactionId ?? null,
          notes: payment.notes ?? null,
          invoice: payment.invoice ? { id: payment.invoice.id, invoiceNumber: payment.invoice.invoiceNumber, status: payment.invoice.status } : null,
        },
        invoice: payment.invoice
          ? {
              id: payment.invoice.id,
              userId: payment.invoice.userId,
              user: payment.user,
              planId: payment.invoice.planId,
              plan: payment.plan,
              paymentId: payment.id,
              amount: payment.invoice.amount,
              status: payment.invoice.status,
              invoiceNumber: payment.invoice.invoiceNumber,
              period: payment.invoice.period,
              notes: payment.invoice.notes ?? null,
            }
          : null,
      } satisfies PaymentActionResponse
    } catch (error) {
      console.error("Error updating payment:", error)
      if (error instanceof z.ZodError) {
        return { error: "Invalid input data" }
      }
      return { error: "Error al actualizar el pago" }
    }
  })
}

export async function deletePayment(id: string): Promise<DeletedPaymentResponse | ErrorResponse> {
  const { user: authUser } = await validateRequest()
  if (!authUser) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    try {
      const existingPayment = await tx.payment.findUnique({
        where: { id },
        include: {
          user: { select: { firstName: true, lastName: true } },
          plan: { select: { name: true, facilityId: true } },
          invoice: { select: { id: true, invoiceNumber: true } },
        },
      })
      if (!existingPayment) throw new Error("Pago no encontrado")

      await tx.invoice.deleteMany({
        where: { paymentId: id },
      })

      const deletedPayment = await tx.payment.delete({
        where: { id },
        include: {
          user: { select: { firstName: true, lastName: true } },
          plan: { select: { name: true } },
        },
      })

      await createPaymentTransaction({
        tx,
        type: "PAYMENT_DELETED",
        paymentId: deletedPayment.id,
        performedById: authUser.id,
        facilityId: existingPayment.plan.facilityId,
        details: {
          action: "Pago eliminado",
          paymentId: deletedPayment.id,
          userId: deletedPayment.userId,
          userName: `${deletedPayment.user.firstName} ${deletedPayment.user.lastName}`,
          planId: deletedPayment.planId,
          planName: deletedPayment.plan.name,
          invoiceId: existingPayment.invoice?.id,
          invoiceNumber: existingPayment.invoice?.invoiceNumber,
        },
      })

      await createNotification({
        tx,
        issuerId: authUser.id,
        facilityId: existingPayment.plan.facilityId,
        type: "PAYMENT_DELETED",
        relatedId: deletedPayment.id,
      })

      /* await createClientNotification({
        tx,
        recipientId: deletedPayment.userId,
        issuerId: authUser.id,
        facilityId: existingPayment.plan.facilityId,
        type: "PAYMENT_DELETED",
        relatedId: deletedPayment.id,
        entityName: `Pago para ${deletedPayment.plan.name}`,
        endDate: new Date(),
      }) */

      revalidatePath("/facturacion/pagos")
      revalidatePath("/facturacion/facturas")
      return {
        success: true as const,
        deletedPayment: {
          id: deletedPayment.id,
          user: deletedPayment.user,
          plan: deletedPayment.plan,
        },
      } satisfies DeletedPaymentResponse
    } catch (error) {
      console.error("Error deleting payment:", error)
      if (error instanceof Error) {
        return { error: error.message }
      }
      return { error: "Error al eliminar el pago" }
    }
  })
}