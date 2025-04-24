"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { z } from "zod"

import { PaymentStatus, InvoiceStatus } from "@prisma/client"
import { PaymentValues, PaymentValuesSchema } from "@/lib/validation"
import { PaymentActionResponse, DeletedPaymentResponse, ErrorResponse } from "@/types/payment"

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
    });

    if (!payment) return null;

    return {
      id: payment.id,
      userId: payment.userId,
      planId: payment.planId,
      amount: payment.amount,
      status: payment.status,
      paymentMonth: payment.paymentMonth,
      transactionId: payment.transactionId ?? undefined,
      notes: payment.notes ?? undefined,
    };
  } catch (error) {
    console.error("Error fetching payment:", error);
    return null;
  }
}

async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const count = await prisma.invoice.count({ where: { invoiceNumber: { startsWith: `FAC-${year}-` } } })
  return `FAC-${year}-${String(count + 1).padStart(3, "0")}`
}

export async function createPayment(values: PaymentValues): Promise<PaymentActionResponse | ErrorResponse> {
  try {
    const validatedValues = PaymentValuesSchema.parse(values)

    const user = await prisma.user.findUnique({ where: { id: validatedValues.userId } })
    if (!user) throw new Error("User not found")
    const plan = await prisma.plan.findUnique({ where: { id: validatedValues.planId } })
    if (!plan) throw new Error("Plan not found")

    const payment = await prisma.payment.create({
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
      invoice = await prisma.invoice.create({
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

    revalidatePath("/facturacion/pagos")
    revalidatePath("/facturacion/facturas")
    return {
      success: true,
      payment: {
        id: payment.id,
        userId: payment.userId,
        user: payment.user,
        planId: payment.planId,
        plan: payment.plan,
        amount: payment.amount,
        status: payment.status,
        paymentMonth: payment.paymentMonth,
        transactionId: payment.transactionId,
        notes: payment.notes,
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
            notes: invoice.notes,
          }
        : null,
    }
  } catch (error) {
    console.error("Error creating payment:", error)
    if (error instanceof z.ZodError) {
      return { error: "Invalid input data" }
    }
    return { error: "Error al crear el pago" }
  }
}

export async function updatePayment(id: string, values: Partial<PaymentValues>): Promise<PaymentActionResponse | ErrorResponse> {
  try {
    const validatedValues = PaymentValuesSchema.partial().parse(values)

    const payment = await prisma.payment.update({
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
      await prisma.invoice.update({
        where: { id: payment.invoice.id },
        data: {
          status: validatedValues.status === "COMPLETED" ? InvoiceStatus.PAID : InvoiceStatus.PENDING,
        },
      })
    }

    revalidatePath("/facturacion/pagos")
    revalidatePath("/facturacion/facturas")
    return {
      success: true,
      payment: {
        id: payment.id,
        userId: payment.userId,
        user: payment.user,
        planId: payment.planId,
        plan: payment.plan,
        amount: payment.amount,
        status: payment.status,
        paymentMonth: payment.paymentMonth,
        transactionId: payment.transactionId,
        notes: payment.notes,
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
            notes: payment.invoice.notes,
          }
        : null,
    }
  } catch (error) {
    console.error("Error updating payment:", error)
    if (error instanceof z.ZodError) {
      return { error: "Invalid input data" }
    }
    return { error: "Error al actualizar el pago" }
  }
}

export async function deletePayment(id: string): Promise<DeletedPaymentResponse | ErrorResponse> {
  try {
    await prisma.invoice.deleteMany({
      where: { paymentId: id },
    })

    const deletedPayment = await prisma.payment.delete({
      where: { id },
      include: {
        user: { select: { firstName: true, lastName: true } },
        plan: { select: { name: true } },
      },
    })

    if (!deletedPayment) {
      throw new Error("Pago no encontrado")
    }

    revalidatePath("/facturacion/pagos")
    revalidatePath("/facturacion/facturas")
    return { success: true, deletedPayment }
  } catch (error) {
    console.error("Error deleting payment:", error)
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: "Error al eliminar el pago" }
  }
}