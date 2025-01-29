import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { PlanData } from "@/types/plan"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<
  NextResponse<{ plans: PlanData[]; total: number } | { error: string }>
> {
  try {
    const id = (await params).facilityId
    const { searchParams } = request.nextUrl
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10", 10)
    const search = searchParams.get("search") || ""
    const skip = (page - 1) * pageSize

    const [plans, total] = await Promise.all([
      prisma.plan.findMany({
        where: {
          facilityId: id,

          OR: [{ name: { contains: search, mode: "insensitive" } }],
        },
        include: {
          diaryPlans: {
            include: {
              activity: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.plan.count({
        where: {
          facilityId: id,

          OR: [{ name: { contains: search, mode: "insensitive" } }],
        },
      }),
    ])

    const formattedPlans: PlanData[] = plans.map((plan) => ({
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
      diariesCount: plan.diariesCount,
      facilityId: id,
      diaryPlans: plan.diaryPlans.map((dp) => ({
        id: dp.id,
        name: dp.name,
        daysOfWeek: dp.daysOfWeek,
        sessionsPerWeek: dp.sessionsPerWeek,
        activityId: dp.activity.id,
        activityName: dp.activity.name,
      })),
    }))

    return NextResponse.json({ plans: formattedPlans, total })
  } catch (error) {
    console.error("Error fetching plans:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}
