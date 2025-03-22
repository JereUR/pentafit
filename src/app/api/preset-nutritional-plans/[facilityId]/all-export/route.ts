import { type NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import formatMealsToString, {
  PresetNutritionalPlanDataExport,
} from "@/types/nutritionalPlans"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<NextResponse<PresetNutritionalPlanDataExport[] | { error: string }>> {
  try {
    const id = (await params).facilityId

    const allPresetNutritionalPlans =
      await prisma.presetNutritionalPlan.findMany({
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
        },
      })

    if (!allPresetNutritionalPlans) {
      return NextResponse.json([])
    }

    const formattedPresetNutritionalPlans: PresetNutritionalPlanDataExport[] =
      allPresetNutritionalPlans.map((presetNutritionalPlan) => ({
        name: presetNutritionalPlan.name,
        description: presetNutritionalPlan.description || "-",
        meals: formatMealsToString(presetNutritionalPlan.dailyMeals),
      }))

    return NextResponse.json(formattedPresetNutritionalPlans)
  } catch (error) {
    console.error("Error fetching NutritionalPlans:", error)
    return NextResponse.json({ error: "Failed to fetch NutritionalPlans" })
  }
}
