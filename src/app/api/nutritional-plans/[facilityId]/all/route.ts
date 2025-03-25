import { type NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import formatMealsToString, {
  NutritionalPlanDataExport,
} from "@/types/nutritionalPlans"
import formatUsersAssignedToString from "@/types/user"
import { validateRequest } from "@/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<NextResponse<NutritionalPlanDataExport[] | { error: string }>> {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 })
    }

    const id = (await params).facilityId

    const allNutritionalPlans = await prisma.nutritionalPlan.findMany({
      where: {
        facilityId: id,
      },
      include: {
        dailyMeals: {
          include: {
            meals: {
              include: {
                foodItems: true,
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
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    })

    if (!allNutritionalPlans) {
      return NextResponse.json([])
    }

    const formattedNutritionalPlans = allNutritionalPlans.map(
      (nutritionalPlan) => {
        const userAssignedString = formatUsersAssignedToString(
          nutritionalPlan.userPlans.map((userPlan) => ({
            firstName: userPlan.user.firstName,
            lastName: userPlan.user.lastName,
            email: userPlan.user.email,
          })),
        )

        return {
          name: nutritionalPlan.name,
          description: nutritionalPlan.description || "-",
          meals: formatMealsToString(nutritionalPlan.dailyMeals),
          assignedUsersCount: userAssignedString,
        }
      },
    )

    return NextResponse.json(formattedNutritionalPlans)
  } catch (error) {
    console.error("Error fetching NutritionalPlans:", error)
    return NextResponse.json({ error: "Failed to fetch NutritionalPlans" })
  }
}
