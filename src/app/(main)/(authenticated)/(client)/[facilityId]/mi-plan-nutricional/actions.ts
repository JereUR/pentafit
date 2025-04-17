"use server"

import { validateRequest } from "@/auth"
import { revalidatePath } from "next/cache"

import prisma from "@/lib/prisma"
import { FoodItemCompletionResult } from "@/types/nutritionaPlansClient"

export async function completeFoodItem({
  foodItemId,
  mealId,
  nutritionalPlanId,
  facilityId,
  completed,
}: {
  foodItemId: string
  mealId: string
  nutritionalPlanId: string
  facilityId: string
  completed: boolean
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

    if (
      foodItem.mealId !== mealId ||
      foodItem.meal.dailyMeal.nutritionalPlanId !== nutritionalPlanId
    ) {
      throw new Error(
        "El elemento de comida no pertenece a este plan nutricional o comida",
      )
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Buscar si ya existe un registro de FoodItem completado para hoy
    const existingCompletion = await prisma.foodItemCompletion.findFirst({
      where: {
        userId: user.id,
        foodItemId,
        mealId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    })

    // Actualizar o crear el registro de FoodItem completado
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
          date: today,
          completed,
          notes: `Elemento de comida ${completed ? "completado" : "no completado"}`,
        },
      })
    }

    // Actualizar el progreso general del plan nutricional
    await updateNutritionProgress(user.id, facilityId, nutritionalPlanId)

    revalidatePath(`/${facilityId}/inicio`)
    revalidatePath(`/${facilityId}/mi-plan-nutricional`)

    return {
      success: true,
      userId: user.id,
    }
  } catch (error) {
    console.error("Error completing food item:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al registrar el elemento de comida completado",
    }
  }
}

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

    // Obtener información de la comida y sus FoodItems
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

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    await prisma.$transaction(async (tx) => {
      for (const foodItem of mealInfo.foodItems) {
        const existingCompletion = await tx.foodItemCompletion.findFirst({
          where: {
            userId: user.id,
            foodItemId: foodItem.id,
            mealId,
            date: {
              gte: today,
              lt: tomorrow,
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
              date: today,
              completed,
              notes: `Elemento de comida ${completed ? "completado" : "no completado"}`,
            },
          })
        }
      }
    })

    // Actualizar el progreso general del plan nutricional
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

    // Verificar que todas las comidas pertenecen al plan nutricional
    const meals = await prisma.meal.findMany({
      where: {
        id: { in: mealIds },
        dailyMeal: {
          nutritionalPlanId,
        },
        foodItems: {
          some: {}, // Asegurar que las comidas tengan FoodItems
        },
      },
      include: {
        foodItems: true,
      },
    })

    if (meals.length !== mealIds.length) {
      throw new Error(
        "Algunas comidas no pertenecen a este plan nutricional o no tienen elementos de comida",
      )
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Actualizar todos los FoodItems en una transacción
    await prisma.$transaction(async (tx) => {
      for (const meal of meals) {
        for (const foodItem of meal.foodItems) {
          const existingCompletion = await tx.foodItemCompletion.findFirst({
            where: {
              userId: user.id,
              foodItemId: foodItem.id,
              mealId: meal.id,
              date: {
                gte: today,
                lt: tomorrow,
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
                date: today,
                completed,
                notes: `Elemento de comida ${completed ? "completado" : "no completado"}`,
              },
            })
          }
        }
      }
    })

    // Actualizar el progreso general del plan nutricional
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
    // Obtener el plan nutricional completo con todos sus FoodItems
    const nutritionalPlan = await prisma.nutritionalPlan.findUnique({
      where: { id: nutritionalPlanId },
      select: {
        id: true,
        dailyMeals: {
          select: {
            id: true,
            meals: {
              select: {
                id: true,
                foodItems: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!nutritionalPlan) {
      throw new Error("Plan nutricional no encontrado")
    }

    // Contar el número total de FoodItems en el plan
    let totalFoodItems = 0
    nutritionalPlan.dailyMeals.forEach((dailyMeal) => {
      dailyMeal.meals.forEach((meal) => {
        totalFoodItems += meal.foodItems.length
      })
    })

    if (totalFoodItems === 0) {
      return {
        success: false,
        message: "No hay elementos de comida en el plan nutricional",
      }
    }

    // Definir el rango de fechas para el cálculo del progreso (por ejemplo, última semana)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const oneWeekAgo = new Date(today)
    oneWeekAgo.setDate(today.getDate() - 7)

    // Obtener todos los FoodItems completados por el usuario para este plan en el período
    const completedFoodItems = await prisma.foodItemCompletion.count({
      where: {
        userId,
        nutritionalPlanId,
        completed: true,
        date: {
          gte: oneWeekAgo,
          lte: today,
        },
      },
    })

    // Calcular el porcentaje de progreso
    const progressPercentage = (completedFoodItems / totalFoodItems) * 100

    // Actualizar el registro de progreso general
    const existingProgress = await prisma.userProgress.findFirst({
      where: {
        userId,
        facilityId,
        type: "NUTRITION_ADHERENCE",
        date: today,
      },
    })

    if (existingProgress) {
      await prisma.userProgress.update({
        where: { id: existingProgress.id },
        data: {
          value: progressPercentage,
          nutritionalPlanId,
          notes: `${completedFoodItems} de ${totalFoodItems} elementos de comida completados (${progressPercentage.toFixed(1)}%)`,
        },
      })
    } else {
      await prisma.userProgress.create({
        data: {
          userId,
          facilityId,
          type: "NUTRITION_ADHERENCE",
          date: today,
          value: progressPercentage,
          nutritionalPlanId,
          notes: `${completedFoodItems} de ${totalFoodItems} elementos de comida completados (${progressPercentage.toFixed(1)}%)`,
        },
      })
    }

    return {
      success: true,
      completedFoodItems,
      totalFoodItems,
      progressPercentage,
    }
  } catch (error) {
    console.error("Error updating nutrition progress:", error)
    throw new Error("Error al actualizar el progreso nutricional")
  }
}
