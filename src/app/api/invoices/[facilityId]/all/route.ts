import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { InvoiceDataExport } from "@/types/invoice";
import { validateRequest } from "@/auth";
import { InvoiceStatus, PaymentStatus } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<NextResponse<InvoiceDataExport[] | { error: string }>> {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const facilityId = (await params).facilityId;

    const invoices = await prisma.invoice.findMany({
      where: {
        plan: {
          facilityId,
        },
      },
      include: {
        user: { select: { firstName: true, lastName: true } },
        plan: { select: { name: true } },
        payment: { select: { id: true, amount: true, status: true } },
      },
    });

    const formattedInvoices: InvoiceDataExport[] = invoices.map((invoice) => ({
      invoiceNumber: invoice.invoiceNumber,
      user: `${invoice.user.firstName} ${invoice.user.lastName}`,
      plan: invoice.plan.name,
      amount: invoice.amount,
      status: invoice.status as InvoiceStatus,
      issueDate: invoice.issueDate.toLocaleDateString(),
      dueDate: invoice.dueDate.toLocaleDateString(),
      period: invoice.period,
      notes: invoice.notes || "",
      payment: invoice.payment
        ? `${invoice.payment.id} (${invoice.payment.status as PaymentStatus})`
        : "",
    }));

    return NextResponse.json(formattedInvoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}