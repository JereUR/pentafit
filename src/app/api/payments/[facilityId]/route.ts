import { type NextRequest, NextResponse } from "next/server"
import prisma, { PAGE_SIZE } from "@/lib/prisma"
import type { PaymentData } from "@/types/payment"
import { validateRequest } from "@/auth"
import { PaymentStatus, InvoiceStatus } from "@prisma/client"
import type { Prisma } from "@prisma/client"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<NextResponse<{ payments: PaymentData[]; total: number } | { error: string }>> {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 })
    }

    const facilityId = (await params).facilityId
    const { searchParams } = request.nextUrl
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const pageSize = Number.parseInt(searchParams.get("pageSize") || PAGE_SIZE.toString(), 10)
    const search = searchParams.get("search") || ""
    const skip = (page - 1) * pageSize

    const where: Prisma.PaymentWhereInput = {
      plan: {
        facilityId,
      },
      ...(search && {
        OR: [
          {
            user: {
              firstName: { contains: search, mode: "insensitive" },
            },
          },
          {
            user: {
              lastName: { contains: search, mode: "insensitive" },
            },
          },
          {
            plan: {
              name: { contains: search, mode: "insensitive" },
            },
          },
          {
            transactionId: { contains: search, mode: "insensitive" },
          },
        ],
      }),
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          user: { select: { firstName: true, lastName: true } },
          plan: { select: { name: true } },
          invoice: { select: { id: true, invoiceNumber: true, status: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.payment.count({ where }),
    ])

    const formattedPayments: PaymentData[] = payments.map((payment) => ({
      id: payment.id,
      user: {
        firstName: payment.user.firstName,
        lastName: payment.user.lastName,
      },
      plan: {
        name: payment.plan.name,
      },
      amount: payment.amount,
      status: payment.status as PaymentStatus,
      paymentMonth: payment.paymentMonth,
      transactionId: payment.transactionId,
      notes: payment.notes,
      invoice: payment.invoice
        ? {
            id: payment.invoice.id,
            invoiceNumber: payment.invoice.invoiceNumber,
            status: payment.invoice.status as InvoiceStatus,
          }
        : null,
    }))

    return NextResponse.json({ payments: formattedPayments, total })
  } catch (error) {
    console.error("Error fetching payments:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}