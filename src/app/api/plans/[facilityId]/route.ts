import { type NextRequest, NextResponse } from "next/server"
import prisma, { PAGE_SIZE } from "@/lib/prisma"
import { PlanData } from "@/types/plan"
import { validateRequest } from "@/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<
  NextResponse<{ plans: PlanData[]; total: number } | { error: string }>
> {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 })
    }

    const facilityId = (await params).facilityId
    const { searchParams } = request.nextUrl
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const pageSize = Number.parseInt(
      searchParams.get("pageSize") || PAGE_SIZE.toString(),
      10,
    )
    const search = searchParams.get("search") || ""
    const skip = (page - 1) * pageSize

    const where = {
      facilityId,
      name: {
        contains: search,
        mode: "insensitive" as const,
      },
    }

    const [plans, total] = await Promise.all([
      prisma.plan.findMany({
        where,
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
          userPlans: {
            where: {
              isActive: true,
            },
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: PAGE_SIZE,
      }),
      prisma.plan.count({ where }),
    ])

    const formattedPlans = plans.map((plan) => ({
      id: plan.id,
      facilityId: plan.facilityId,
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
      diaryPlans: plan.diaryPlans.map((dp) => ({
        id: dp.id,
        name: dp.activity.name,
        daysOfWeek: dp.daysOfWeek,
        sessionsPerWeek: dp.sessionsPerWeek,
        activityId: dp.activity.id,
      })),
      assignedUsersCount: plan.userPlans.length,
      assignedUsers: plan.userPlans.map((up) => up.user),
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
