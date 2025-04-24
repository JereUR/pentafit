import { type NextRequest, NextResponse } from "next/server"
import prisma, { PAGE_SIZE } from "@/lib/prisma"
import type { InvoiceData } from "@/types/invoice"
import { validateRequest } from "@/auth"
import { InvoiceStatus, PaymentStatus } from "@prisma/client"
import type { Prisma } from "@prisma/client"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<NextResponse<{ invoices: InvoiceData[]; total: number } | { error: string }>> {
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

    const where: Prisma.InvoiceWhereInput = {
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
            invoiceNumber: { contains: search, mode: "insensitive" },
          },
        ],
      }),
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          user: { select: { firstName: true, lastName: true } },
          plan: { select: { name: true } },
          payment: { select: { id: true, amount: true, status: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.invoice.count({ where }),
    ])

    const formattedInvoices: InvoiceData[] = invoices.map((invoice) => ({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      user: {
        firstName: invoice.user.firstName,
        lastName: invoice.user.lastName,
      },
      plan: {
        name: invoice.plan.name,
      },
      amount: invoice.amount,
      status: invoice.status as InvoiceStatus,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      period: invoice.period,
      notes: invoice.notes,
      payment: invoice.payment
        ? {
            id: invoice.payment.id,
            amount: invoice.payment.amount,
            status: invoice.payment.status as PaymentStatus,
          }
        : null,
    }))

    return NextResponse.json({ invoices: formattedInvoices, total })
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}