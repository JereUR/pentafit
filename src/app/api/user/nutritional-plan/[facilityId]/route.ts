import { type NextRequest, NextResponse } from "next/server"
import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
) {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const facilityId = (await params).facilityId
    const userId = user.id

    const userFacility = await prisma.userFacility.findUnique({
      where: {
        userId_facilityId: {
          userId,
          facilityId,
        },
      },
    })

    if (!userFacility) {
      return NextResponse.json(
        { error: "User does not belong to this facility" },
        { status: 403 },
      )
    }

    const userNutritionalPlan = await prisma.userNutritionalPlan.findFirst({
      where: {
        userId,
        isActive: true,
        nutritionalPlan: {
          facilityId,
        },
      },
      include: {
        nutritionalPlan: {
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
        },
      },
    })

    if (!userNutritionalPlan) {
      return NextResponse.json({
        success: true,
        data: null,
      })
    }

    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0)

    const weekStartDate = new Date(todayDate)
    weekStartDate.setDate(weekStartDate.getDate() - 7)

    const completedFoodItems = await prisma.foodItemCompletion.findMany({
      where: {
        userId,
        facilityId,
        nutritionalPlanId: userNutritionalPlan.nutritionalPlanId,
        date: {
          gte: weekStartDate,
        },
        completed: true,
      },
      select: {
        foodItemId: true,
        mealId: true,
        date: true,
      },
    })

    const completedMealIds: string[] = []
    const data = {
      id: userNutritionalPlan.nutritionalPlanId,
      name: userNutritionalPlan.nutritionalPlan.name,
      description: userNutritionalPlan.nutritionalPlan.description,
      dailyMeals: userNutritionalPlan.nutritionalPlan.dailyMeals.map(
        (dailyMeal) => ({
          dayOfWeek: dailyMeal.dayOfWeek,
          meals: dailyMeal.meals.map((meal) => {
            const mealFoodItems = meal.foodItems.map((foodItem) => ({
              id: foodItem.id,
              name: foodItem.name,
              portion: foodItem.portion,
              unit: foodItem.unit,
              calories: foodItem.calories,
              protein: foodItem.protein,
              carbs: foodItem.carbs,
              fat: foodItem.fat,
              notes: foodItem.notes,
              completed: completedFoodItems.some(
                (completion) =>
                  completion.foodItemId === foodItem.id &&
                  completion.mealId === meal.id &&
                  completion.date.getTime() === todayDate.getTime(),
              ),
            }))

            const isMealCompleted = mealFoodItems.every(
              (foodItem) => foodItem.completed,
            )
            if (isMealCompleted) {
              completedMealIds.push(meal.id)
            }

            return {
              id: meal.id,
              mealType: meal.mealType,
              time: meal.time,
              foodItems: mealFoodItems,
              completed: isMealCompleted,
            }
          }),
        }),
      ),
      completedMeals: completedMealIds,
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error fetching user nutritional plan:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener el plan nutricional",
      },
      { status: 500 },
    )
  }
}
