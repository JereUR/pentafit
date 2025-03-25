import { NextRequest, NextResponse } from "next/server"
import { Role } from "@prisma/client"
import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"
import { FacilityMetrics } from "@/hooks/useMetrics"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<FacilityMetrics | NextResponse> {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const facilityId = (await params).facilityId

    const [
      activeActivities,
      currentPlans,
      activeDiaries,
      activeRoutines,
      activeNutritionalPlans,
      teamMembers,
      clientMembers,
    ] = await Promise.all([
      prisma.activity.count({
        where: {
          facilityId,
        },
      }),
      prisma.plan.count({
        where: {
          facilityId,
        },
      }),
      prisma.diary.count({
        where: {
          facilityId,
        },
      }),
      prisma.routine.count({
        where: {
          facilityId,
        },
      }),
      prisma.nutritionalPlan.count({
        where: {
          facilityId,
        },
      }),
      prisma.user.count({
        where: {
          facilities: {
            some: {
              facilityId,
            },
          },
          role: {
            in: [Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN],
          },
        },
      }),
      prisma.user.count({
        where: {
          facilities: {
            some: {
              facilityId,
            },
          },
          role: Role.CLIENT,
        },
      }),
    ])

    return NextResponse.json({
      activeActivities,
      currentPlans,
      activeDiaries,
      activeRoutines,
      activeNutritionalPlans,
      teamMembers,
      clientMembers,
    })
  } catch (error) {
    console.error("Error fetching metrics:", error)
    return NextResponse.json(
      { error: "Error al cargar las métricas" },
      { status: 500 },
    )
  }
}
