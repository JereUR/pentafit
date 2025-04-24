"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { InvoiceStatus } from "@prisma/client"
import prisma from "@/lib/prisma"
import { InvoiceValues, InvoiceValuesSchema } from "@/lib/validation"
import { InvoiceResponse, DeletedInvoiceResponse, ErrorResponse } from "@/types/invoice"

export const getInvoiceById = async (id: string) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        plan: { select: { id: true, name: true, price: true } },
        payment: { select: { id: true, amount: true, status: true } },
      },
    })

    if (!invoice) {
      throw new Error("Factura no encontrada")
    }

    return {
      id: invoice.id,
      userId: invoice.userId,
      user: {
        id: invoice.user.id,
        firstName: invoice.user.firstName,
        lastName: invoice.user.lastName,
        email: invoice.user.email,
      },
      planId: invoice.planId,
      plan: {
        id: invoice.plan.id,
        name: invoice.plan.name,
        price: invoice.plan.price,
      },
      paymentId: invoice.paymentId || null,
      payment: invoice.payment
        ? { id: invoice.payment.id, amount: invoice.payment.amount, status: invoice.payment.status }
        : null,
      amount: invoice.amount,
      status: invoice.status,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      invoiceNumber: invoice.invoiceNumber,
      period: invoice.period,
      notes: invoice.notes,
    }
  } catch (error) {
    console.error("Error fetching invoice:", error)
    throw new Error("Failed to fetch invoice")
  }
}

async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const count = await prisma.invoice.count({ where: { invoiceNumber: { startsWith: `FAC-${year}-` } } })
  return `FAC-${year}-${String(count + 1).padStart(3, "0")}`
}

export async function createInvoice(values: InvoiceValues): Promise<InvoiceResponse | ErrorResponse> {
  try {
    const validatedValues = InvoiceValuesSchema.parse(values)

    const user = await prisma.user.findUnique({ where: { id: validatedValues.userId } })
    if (!user) throw new Error("User not found")
    const plan = await prisma.plan.findUnique({ where: { id: validatedValues.planId } })
    if (!plan) throw new Error("Plan not found")

    const invoice = await prisma.invoice.create({
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

    revalidatePath("/facturacion/facturas")
    return {
      success: true,
      invoice: {
        id: invoice.id,
        userId: invoice.userId,
        user: invoice.user,
        planId: invoice.planId,
        plan: invoice.plan,
        paymentId: invoice.paymentId || null,
        amount: invoice.amount,
        status: invoice.status,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        invoiceNumber: invoice.invoiceNumber,
        period: invoice.period,
        notes: invoice.notes,
      },
    }
  } catch (error) {
    console.error("Error creating invoice:", error)
    if (error instanceof z.ZodError) {
      return { error: "Invalid input data" }
    }
    return { error: "Error al crear la factura" }
  }
}

export async function updateInvoice(id: string, values: Partial<InvoiceValues>): Promise<InvoiceResponse | ErrorResponse> {
  try {
    const validatedValues = InvoiceValuesSchema.partial().parse(values)

    const invoice = await prisma.invoice.update({
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

    revalidatePath("/facturacion/facturas")
    return {
      success: true,
      invoice: {
        id: invoice.id,
        userId: invoice.userId,
        user: invoice.user,
        planId: invoice.planId,
        plan: invoice.plan,
        paymentId: invoice.paymentId || null,
        amount: invoice.amount,
        status: invoice.status,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        invoiceNumber: invoice.invoiceNumber,
        period: invoice.period,
        notes: invoice.notes,
      },
    }
  } catch (error) {
    console.error("Error updating invoice:", error)
    if (error instanceof z.ZodError) {
      return { error: "Invalid input data" }
    }
    return { error: "Error al actualizar la factura" }
  }
}

export async function deleteInvoice(id: string): Promise<DeletedInvoiceResponse | ErrorResponse> {
  try {
    const deletedInvoice = await prisma.invoice.delete({
      where: { id },
      include: {
        user: { select: { firstName: true, lastName: true } },
        plan: { select: { name: true } },
      },
    })

    if (!deletedInvoice) {
      throw new Error("Factura no encontrada")
    }

    revalidatePath("/facturacion/facturas")
    return {
      success: true,
      deletedInvoice: {
        id: deletedInvoice.id,
        user: deletedInvoice.user,
        plan: deletedInvoice.plan,
        invoiceNumber: deletedInvoice.invoiceNumber,
      },
    }
  } catch (error) {
    console.error("Error deleting invoice:", error)
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: "Error al eliminar la factura" }
  }
}