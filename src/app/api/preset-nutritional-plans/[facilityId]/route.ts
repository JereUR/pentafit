import prisma from "@/lib/prisma"
import formatMealsToString, {
  NutritionalPlanData,
} from "@/types/nutritionalPlans"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<
  NextResponse<
    | { presetNutritionalPlans: NutritionalPlanData[]; total: number }
    | { error: string }
  >
> {
  try {
    const id = (await params).facilityId
    const { searchParams } = request.nextUrl
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10", 10)
    const search = searchParams.get("search") || ""
    const skip = (page - 1) * pageSize

    const [presetNutritionalPlans, total] = await Promise.all([
      prisma.presetNutritionalPlan.findMany({
        where: {
          facilityId: id,
          OR: [{ name: { contains: search, mode: "insensitive" } }],
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
        skip,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.nutritionalPlan.count({
        where: {
          facilityId: id,
          OR: [{ name: { contains: search, mode: "insensitive" } }],
        },
      }),
    ])

    const formattedPresetNutritionalPlans: NutritionalPlanData[] =
      presetNutritionalPlans.map((plan) => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        facilityId: id,
        dailyMeals: plan.dailyMeals.map((dailyMeal) => ({
          id: dailyMeal.id,
          dayOfWeek: dailyMeal.dayOfWeek,
          nutritionalPlanId: dailyMeal.nutritionalPlanId,
          meals: dailyMeal.meals.map((meal) => ({
            id: meal.id,
            mealType: meal.mealType,
            time: meal.time,
            dailyMealId: meal.dailyMealId,
            foodItems: meal.foodItems.map((item) => ({
              id: item.id,
              name: item.name,
              portion: item.portion,
              unit: item.unit,
              calories: item.calories,
              protein: item.protein,
              carbs: item.carbs,
              fat: item.fat,
              notes: item.notes,
              mealId: item.mealId,
            })),
          })),
          createdAt: dailyMeal.createdAt,
          updatedAt: dailyMeal.updatedAt,
        })),
        meals: formatMealsToString(plan.dailyMeals),
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
      }))

    return NextResponse.json({
      presetNutritionalPlans: formattedPresetNutritionalPlans,
      total,
    })
  } catch (error) {
    console.error("Error fetching nutritional plans:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}
