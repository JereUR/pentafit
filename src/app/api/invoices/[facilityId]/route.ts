import { type NextRequest, NextResponse } from "next/server"

import prisma, { PAGE_SIZE } from "@/lib/prisma"
import type { InvoiceData } from "@/types/invoice"
import { validateRequest } from "@/auth"
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
        skip,
        take: PAGE_SIZE,
        orderBy: { issueDate: "desc" },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          plan: {
            select: {
              id: true,
              name: true,
              price: true,
              
          facility: {
            select: {
              id: true,
              name: true,
              email: true,
              address: true,
              phone: true,
              instagram: true,
              facebook: true,
              logoUrl: true,
            },
          },
            },
          },
          payment: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      }),
      prisma.invoice.count({ where }),
    ])

    const formattedInvoices: InvoiceData[] = invoices.map((invoice) => ({
      id: invoice.id,
      user: {
        id: invoice.user.id,
        firstName: invoice.user.firstName,
        lastName: invoice.user.lastName,
        email: invoice.user.email,
      },
      plan: {
        id: invoice.plan.id,
        name: invoice.plan.name,
        price: invoice.plan.price,
      },
      payment: invoice.payment
        ? {
            id: invoice.payment.id,
            status: invoice.payment.status,
          }
        : null,
      facility: {
        id: invoice.plan.facility.id,
        name: invoice.plan.facility.name,
        email: invoice.plan.facility.email,
        address: invoice.plan.facility.address,
        phone: invoice.plan.facility.phone,
        instagram: invoice.plan.facility.instagram,
        facebook: invoice.plan.facility.facebook,
        logoUrl: invoice.plan.facility.logoUrl,
      },
      amount: invoice.amount,
      status: invoice.status,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      invoiceNumber: invoice.invoiceNumber,
      period: invoice.period,
      notes: invoice.notes,
    }));

    return NextResponse.json({ invoices: formattedInvoices, total })
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}