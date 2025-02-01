import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { formatDiaryPlans, PlanDataExport } from "@/types/plan"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<NextResponse<PlanDataExport[] | { error: string }>> {
  try {
    const id = (await params).facilityId

    const allPlans = await prisma.plan.findMany({
      where: {
        facilityId: id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        startDate: true,
        endDate: true,
        expirationPeriod: true,
        generateInvoice: true,
        paymentTypes: true,
        planType: true,
        freeTest: true,
        current: true,
        diaryPlans: true,
      },
    })

    if (!allPlans) {
      return NextResponse.json([])
    }

    const formattedAllPlans: PlanDataExport[] = allPlans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      startDate: plan.startDate,
      endDate: plan.endDate,
      expirationPeriod: plan.expirationPeriod,
      generateInvoice: plan.generateInvoice,
      paymentTypes: plan.paymentTypes,
      planType: plan.planType,
      freeTest: plan.freeTest,
      current: plan.current,
      facilityId: id,
      diaryPlans: formatDiaryPlans(plan.diaryPlans),
    }))

    return NextResponse.json(formattedAllPlans)
  } catch (error) {
    console.error("Error fetching plans:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}
