"use server"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { MealCompletionResult } from "@/types/nutritionaPlansClient"
import { DayOfWeek } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function completeMeal({
  mealId,
  nutritionalPlanId,
  facilityId,
  completed,
}: {
  mealId: string
  nutritionalPlanId: string
  facilityId: string
  completed: boolean
}): Promise<MealCompletionResult> {
  try {
    const { user } = await validateRequest()

    if (!user) {
      throw new Error("No autorizado.")
    }

    const userFacility = await prisma.userFacility.findUnique({
      where: {
        userId_facilityId: {
          userId: user.id,
          facilityId,
        },
      },
    })

    if (!userFacility) {
      throw new Error("El usuario no pertenece a este establecimiento")
    }

    const userNutritionalPlan = await prisma.userNutritionalPlan.findFirst({
      where: {
        userId: user.id,
        nutritionalPlanId,
        isActive: true,
      },
    })

    if (!userNutritionalPlan) {
      throw new Error("El usuario no tiene asignado este plan nutricional")
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const existingProgress = await prisma.userProgress.findFirst({
      where: {
        userId: user.id,
        facilityId,
        type: "NUTRITION_ADHERENCE",
        date: {
          gte: today,
          lt: tomorrow,
        },
        mealId,
      },
    })

    if (existingProgress) {
      await prisma.userProgress.update({
        where: {
          id: existingProgress.id,
        },
        data: {
          value: completed ? 100 : 0,
          updatedAt: new Date(),
        },
      })
    } else {
      await prisma.userProgress.create({
        data: {
          userId: user.id,
          facilityId,
          type: "NUTRITION_ADHERENCE",
          date: today,
          value: completed ? 100 : 0,
          mealId,
          notes: `Comida ${completed ? "completada" : "no completada"}`,
        },
      })
    }

    await updateNutritionProgress(user.id, facilityId, nutritionalPlanId)

    revalidatePath(`/${facilityId}/inicio`)
    revalidatePath(`/${facilityId}/mi-plan-nutricional`)

    return {
      success: true,
      userId: user.id,
    }
  } catch (error) {
    console.error("Error completing meal:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al registrar la comida completada",
    }
  }
}

export async function completeAllMeals({
  mealIds,
  nutritionalPlanId,
  facilityId,
  completed,
}: {
  mealIds: string[]
  nutritionalPlanId: string
  facilityId: string
  completed: boolean
}): Promise<MealCompletionResult> {
  try {
    const { user } = await validateRequest()

    if (!user) {
      throw new Error("No autorizado.")
    }

    const userFacility = await prisma.userFacility.findUnique({
      where: {
        userId_facilityId: {
          userId: user.id,
          facilityId,
        },
      },
    })

    if (!userFacility) {
      throw new Error("El usuario no pertenece a este establecimiento")
    }

    const userNutritionalPlan = await prisma.userNutritionalPlan.findFirst({
      where: {
        userId: user.id,
        nutritionalPlanId,
        isActive: true,
      },
    })

    if (!userNutritionalPlan) {
      throw new Error("El usuario no tiene asignado este plan nutricional")
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    await prisma.$transaction(async (tx) => {
      for (const mealId of mealIds) {
        const existingProgress = await tx.userProgress.findFirst({
          where: {
            userId: user.id,
            facilityId,
            type: "NUTRITION_ADHERENCE",
            date: {
              gte: today,
              lt: tomorrow,
            },
            mealId,
          },
        })

        if (existingProgress) {
          await tx.userProgress.update({
            where: {
              id: existingProgress.id,
            },
            data: {
              value: completed ? 100 : 0,
              updatedAt: new Date(),
            },
          })
        } else {
          await tx.userProgress.create({
            data: {
              userId: user.id,
              facilityId,
              type: "NUTRITION_ADHERENCE",
              date: today,
              value: completed ? 100 : 0,
              mealId,
              notes: `Comida ${completed ? "completada" : "no completada"}`,
            },
          })
        }
      }
    })

    await updateNutritionProgress(user.id, facilityId, nutritionalPlanId)

    revalidatePath(`/${facilityId}/inicio`)
    revalidatePath(`/${facilityId}/mi-plan-nutricional`)

    return {
      success: true,
      userId: user.id,
    }
  } catch (error) {
    console.error("Error completing all meals:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al registrar las comidas completadas",
    }
  }
}

export async function updateNutritionProgress(
  userId: string,
  facilityId: string,
  nutritionalPlanId: string,
) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const days = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ]
    const currentDayOfWeek = days[today.getDay()]

    const dailyMeals = await prisma.dailyMeal.findFirst({
      where: {
        nutritionalPlanId,
        dayOfWeek: currentDayOfWeek as DayOfWeek,
      },
      include: {
        meals: true,
      },
    })

    if (!dailyMeals) {
      return { success: false, error: "No hay comidas programadas para hoy" }
    }

    const totalMeals = dailyMeals.meals.length

    const completedMeals = await prisma.userProgress.count({
      where: {
        userId,
        facilityId,
        type: "NUTRITION_ADHERENCE",
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
        value: 100,
        mealId: {
          in: dailyMeals.meals.map((meal) => meal.id),
        },
      },
    })

    const nutritionProgress =
      totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0

    const existingOverallProgress = await prisma.userProgress.findFirst({
      where: {
        userId,
        facilityId,
        type: "NUTRITION_ADHERENCE",
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
        mealId: null,
      },
    })

    if (existingOverallProgress) {
      await prisma.userProgress.update({
        where: {
          id: existingOverallProgress.id,
        },
        data: {
          value: nutritionProgress,
          updatedAt: new Date(),
        },
      })
    } else {
      await prisma.userProgress.create({
        data: {
          userId,
          facilityId,
          type: "NUTRITION_ADHERENCE",
          date: today,
          value: nutritionProgress,
        },
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating nutrition progress:", error)
    throw new Error("Error al actualizar el progreso nutricional")
  }
}
