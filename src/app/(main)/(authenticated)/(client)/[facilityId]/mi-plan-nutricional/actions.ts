"use server"

import { validateRequest } from "@/auth"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import type { FoodItemCompletionResult } from "@/types/nutritionaPlansClient"
import { getDateForDayOfWeek } from "@/lib/utils"
import type { DayOfWeek } from "@prisma/client"
import { updateDailyNutritionProgress } from "../mi-progreso/actions"

export async function completeFoodItem({
  foodItemId,
  mealId,
  nutritionalPlanId,
  facilityId,
  completed,
  dayOfWeek,
}: {
  foodItemId: string
  mealId: string
  nutritionalPlanId: string
  facilityId: string
  completed: boolean
  dayOfWeek: DayOfWeek
}): Promise<FoodItemCompletionResult> {
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

    const foodItem = await prisma.foodItem.findUnique({
      where: { id: foodItemId },
      include: {
        meal: {
          include: {
            dailyMeal: true,
          },
        },
      },
    })

    if (!foodItem) {
      throw new Error("Elemento de comida no encontrado")
    }

    if (foodItem.mealId !== mealId || foodItem.meal.dailyMeal.nutritionalPlanId !== nutritionalPlanId) {
      throw new Error("El elemento de comida no pertenece a este plan nutricional o comida")
    }

    const targetDate = getDateForDayOfWeek(dayOfWeek)
    const nextDay = new Date(targetDate)
    nextDay.setDate(nextDay.getDate() + 1)

    const existingCompletion = await prisma.foodItemCompletion.findFirst({
      where: {
        userId: user.id,
        foodItemId,
        mealId,
        date: {
          gte: targetDate,
          lt: nextDay,
        },
      },
    })

    if (existingCompletion) {
      await prisma.foodItemCompletion.update({
        where: {
          id: existingCompletion.id,
        },
        data: {
          completed,
          updatedAt: new Date(),
        },
      })
    } else {
      await prisma.foodItemCompletion.create({
        data: {
          userId: user.id,
          facilityId,
          foodItemId,
          mealId,
          nutritionalPlanId,
          date: targetDate,
          completed,
          notes: `Elemento de comida ${completed ? "completado" : "no completado"}`,
        },
      })
    }

    await updateDailyNutritionProgress(user.id, facilityId, nutritionalPlanId, targetDate)

    revalidatePath(`/${facilityId}/inicio`)
    revalidatePath(`/${facilityId}/mi-plan-nutricional`)
    revalidatePath(`/${facilityId}/mi-progreso`)

    return {
      success: true,
      userId: user.id,
    }
  } catch (error) {
    console.error("Error completing food item:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al registrar el elemento de comida completado",
    }
  }
}

export async function completeMeal({
  mealId,
  nutritionalPlanId,
  facilityId,
  completed,
  dayOfWeek,
}: {
  mealId: string
  nutritionalPlanId: string
  facilityId: string
  completed: boolean
  dayOfWeek: DayOfWeek
}): Promise<FoodItemCompletionResult> {
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

    const mealInfo = await prisma.meal.findUnique({
      where: { id: mealId },
      include: {
        dailyMeal: true,
        foodItems: true,
      },
    })

    if (!mealInfo) {
      throw new Error("Comida no encontrada")
    }

    if (mealInfo.dailyMeal.nutritionalPlanId !== nutritionalPlanId) {
      throw new Error("La comida no pertenece a este plan nutricional")
    }

    const targetDate = getDateForDayOfWeek(dayOfWeek)
    const nextDay = new Date(targetDate)
    nextDay.setDate(nextDay.getDate() + 1)

    await prisma.$transaction(async (tx) => {
      for (const foodItem of mealInfo.foodItems) {
        const existingCompletion = await tx.foodItemCompletion.findFirst({
          where: {
            userId: user.id,
            foodItemId: foodItem.id,
            mealId,
            date: {
              gte: targetDate,
              lt: nextDay,
            },
          },
        })

        if (existingCompletion) {
          await tx.foodItemCompletion.update({
            where: {
              id: existingCompletion.id,
            },
            data: {
              completed,
              updatedAt: new Date(),
            },
          })
        } else {
          await tx.foodItemCompletion.create({
            data: {
              userId: user.id,
              facilityId,
              foodItemId: foodItem.id,
              mealId,
              nutritionalPlanId,
              date: targetDate,
              completed,
              notes: `Elemento de comida ${completed ? "completado" : "no completado"}`,
            },
          })
        }
      }
    })

    await updateDailyNutritionProgress(user.id, facilityId, nutritionalPlanId, targetDate)

    revalidatePath(`/${facilityId}/inicio`)
    revalidatePath(`/${facilityId}/mi-plan-nutricional`)
    revalidatePath(`/${facilityId}/mi-progreso`)

    return {
      success: true,
      userId: user.id,
    }
  } catch (error) {
    console.error("Error completing meal:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al registrar la comida completada",
    }
  }
}

export async function completeAllMeals({
  mealIds,
  nutritionalPlanId,
  facilityId,
  completed,
  dayOfWeek,
}: {
  mealIds: string[]
  nutritionalPlanId: string
  facilityId: string
  completed: boolean
  dayOfWeek: DayOfWeek
}): Promise<FoodItemCompletionResult> {
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

    const meals = await prisma.meal.findMany({
      where: {
        id: { in: mealIds },
        dailyMeal: {
          nutritionalPlanId,
        },
        foodItems: {
          some: {}, 
        },
      },
      include: {
        foodItems: true,
      },
    })

    if (meals.length !== mealIds.length) {
      throw new Error("Algunas comidas no pertenecen a este plan nutricional o no tienen elementos de comida")
    }

    const targetDate = getDateForDayOfWeek(dayOfWeek)
    const nextDay = new Date(targetDate)
    nextDay.setDate(nextDay.getDate() + 1)

    await prisma.$transaction(async (tx) => {
      for (const meal of meals) {
        for (const foodItem of meal.foodItems) {
          const existingCompletion = await tx.foodItemCompletion.findFirst({
            where: {
              userId: user.id,
              foodItemId: foodItem.id,
              mealId: meal.id,
              date: {
                gte: targetDate,
                lt: nextDay,
              },
            },
          })

          if (existingCompletion) {
            await tx.foodItemCompletion.update({
              where: {
                id: existingCompletion.id,
              },
              data: {
                completed,
                updatedAt: new Date(),
              },
            })
          } else {
            await tx.foodItemCompletion.create({
              data: {
                userId: user.id,
                facilityId,
                foodItemId: foodItem.id,
                mealId: meal.id,
                nutritionalPlanId,
                date: targetDate,
                completed,
                notes: `Elemento de comida ${completed ? "completado" : "no completado"}`,
              },
            })
          }
        }
      }
    })

    await updateDailyNutritionProgress(user.id, facilityId, nutritionalPlanId, targetDate)

    revalidatePath(`/${facilityId}/inicio`)
    revalidatePath(`/${facilityId}/mi-plan-nutricional`)
    revalidatePath(`/${facilityId}/mi-progreso`)

    return {
      success: true,
      userId: user.id,
    }
  } catch (error) {
    console.error("Error completing all meals:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al registrar las comidas completadas",
    }
  }
}
