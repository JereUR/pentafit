import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { PaymentDataExport } from "@/types/payment";
import { validateRequest } from "@/auth";
import { PaymentStatus, InvoiceStatus } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<NextResponse<PaymentDataExport[] | { error: string }>> {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const facilityId = (await params).facilityId;

    const payments = await prisma.payment.findMany({
      where: {
        plan: {
          facilityId,
        },
      },
      include: {
        user: { select: { firstName: true, lastName: true } },
        plan: { select: { name: true } },
        invoice: { select: { invoiceNumber: true, status: true } },
      },
    });

    const formattedPayments: PaymentDataExport[] = payments.map((payment) => ({
      user: `${payment.user.firstName} ${payment.user.lastName}`,
      plan: payment.plan.name,
      amount: payment.amount,
      status: payment.status as PaymentStatus,
      paymentMonth: payment.paymentMonth,
      transactionId: payment.transactionId || "",
      notes: payment.notes || "",
      invoice: payment.invoice
        ? `${payment.invoice.invoiceNumber} (${payment.invoice.status as InvoiceStatus})`
        : "",
    }));

    return NextResponse.json(formattedPayments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}