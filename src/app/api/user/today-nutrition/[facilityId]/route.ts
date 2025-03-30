import { NextRequest, NextResponse } from "next/server"

import { validateRequest } from "@/auth"
import { getCurrentDayOfWeek } from "@/lib/utils"
import prisma from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
) {
  try {
    const { user } = await validateRequest()
    if (!user) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 })
    }
    const userId = user.id
    const facilityId = (await params).facilityId
    const today = getCurrentDayOfWeek()

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
        { error: "El usuario no pertenece a esta instalación" },
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
              where: {
                dayOfWeek: today,
              },
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

    if (
      !userNutritionalPlan ||
      !userNutritionalPlan.nutritionalPlan.dailyMeals.length
    ) {
      return NextResponse.json({
        success: true,
        data: null,
      })
    }

    const dailyMeal = userNutritionalPlan.nutritionalPlan.dailyMeals[0]

    const data = {
      id: userNutritionalPlan.nutritionalPlanId,
      name: userNutritionalPlan.nutritionalPlan.name,
      description: userNutritionalPlan.nutritionalPlan.description,
      meals: dailyMeal.meals.map((meal) => ({
        id: meal.id,
        mealType: meal.mealType,
        time: meal.time,
        foodItems: meal.foodItems.map((food) => ({
          id: food.id,
          name: food.name,
          portion: food.portion,
          unit: food.unit,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          notes: food.notes,
        })),
      })),
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error fetching today's nutritional plan:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener el plan nutricional de hoy",
      },
      { status: 500 },
    )
  }
}
