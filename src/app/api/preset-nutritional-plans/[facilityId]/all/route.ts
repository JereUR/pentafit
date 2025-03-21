import { type NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import formatMealsToString, {
  NutritionalPlanData,
} from "@/types/nutritionalPlans"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<NextResponse<NutritionalPlanData[] | { error: string }>> {
  try {
    const id = (await params).facilityId

    const presetNutritionalPlans = await prisma.presetNutritionalPlan.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    })

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
          presetNutritionalPlanId: dailyMeal.presetNutritionalPlanId,
          meals: dailyMeal.meals.map((meal) => ({
            id: meal.id,
            mealType: meal.mealType,
            time: meal.time,
            dailyMealId: meal.dailyMealId,
            foodItems: meal.foodItems.map((foodItem) => ({
              id: foodItem.id,
              name: foodItem.name,
              portion: foodItem.portion,
              unit: foodItem.unit,
              calories: foodItem.calories,
              protein: foodItem.protein,
              carbs: foodItem.carbs,
              fat: foodItem.fat,
              notes: foodItem.notes,
              mealId: foodItem.mealId,
              createdAt: foodItem.createdAt,
              updatedAt: foodItem.updatedAt,
            })),
            createdAt: meal.createdAt,
            updatedAt: meal.updatedAt,
          })),
          createdAt: dailyMeal.createdAt,
          updatedAt: dailyMeal.updatedAt,
        })),
        meals: formatMealsToString(plan.dailyMeals),
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
      }))

    return NextResponse.json(formattedPresetNutritionalPlans)
  } catch (error) {
    console.error("Error fetching preset nutritional plans:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}
