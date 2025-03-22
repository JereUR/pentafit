/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { revalidatePath } from "next/cache"
import { cache } from "react"
import { notFound } from "next/navigation"

import prisma from "@/lib/prisma"
import { createNotification } from "@/lib/notificationHelpers"
import {
  NotificationType,
  Prisma,
  TransactionType,
  type DayOfWeek,
} from "@prisma/client"
import { validateRequest } from "@/auth"
import type { DeleteEntityResult } from "@/lib/utils"
import { createPresetNutritionalPlanTransaction } from "@/lib/transactionHelpers"
import { NutritionalPlanData } from "@/types/nutritionalPlans"
import { DailyMealsValues, NutritionalPlanValues } from "@/lib/validation"

type PresetNutritionalPlanResult = {
  success: boolean
  presetNutritionalPlan?: NutritionalPlanData | null
  error?: string
}

export const getPresetNutritionalPlanById = cache(
  async (id: string): Promise<NutritionalPlanValues & { id: string }> => {
    try {
      const presetNutritionalPlan =
        await prisma.presetNutritionalPlan.findUnique({
          where: { id },
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

      if (!presetNutritionalPlan) {
        notFound()
      }

      const dailyMeals: DailyMealsValues = {
        MONDAY: [],
        TUESDAY: [],
        WEDNESDAY: [],
        THURSDAY: [],
        FRIDAY: [],
        SATURDAY: [],
        SUNDAY: [],
      }

      presetNutritionalPlan.dailyMeals.forEach((dailyMeal) => {
        const day = dailyMeal.dayOfWeek
        dailyMeals[day] = dailyMeal.meals.map((meal) => ({
          mealType: meal.mealType,
          time: meal.time,
          foodItems: meal.foodItems.map((foodItem) => ({
            name: foodItem.name,
            portion: foodItem.portion,
            unit: foodItem.unit,
            calories: foodItem.calories,
            protein: foodItem.protein,
            carbs: foodItem.carbs,
            fat: foodItem.fat,
            notes: foodItem.notes,
          })),
        }))
      })

      return {
        id: presetNutritionalPlan.id,
        name: presetNutritionalPlan.name,
        description: presetNutritionalPlan.description || "",
        facilityId: presetNutritionalPlan.facilityId,
        dailyMeals,
      }
    } catch (error) {
      console.error("Error fetching preset nutritional plan:", error)
      throw new Error("Failed to fetch preset nutritional plan")
    }
  },
)

export async function createPresetNutritionalPlan(
  values: NutritionalPlanValues,
): Promise<PresetNutritionalPlanResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      const presetNutritionalPlan = await tx.presetNutritionalPlan.create({
        data: {
          name: values.name,
          description: values.description ?? undefined,
          facilityId: values.facilityId,
        },
      })

      const daysOfWeek = Object.keys(values.dailyMeals) as DayOfWeek[]

      for (const day of daysOfWeek) {
        const meals = values.dailyMeals[day]

        if (meals.length > 0) {
          const dailyMeal = await tx.dailyMeal.create({
            data: {
              dayOfWeek: day,
              presetNutritionalPlanId: presetNutritionalPlan.id,
            },
          })

          for (const meal of meals) {
            const createdMeal = await tx.meal.create({
              data: {
                mealType: meal.mealType,
                time: meal.time ?? null,
                dailyMealId: dailyMeal.id,
              },
            })

            if (meal.foodItems.length > 0) {
              await tx.foodItem.createMany({
                data: meal.foodItems.map((foodItem) => ({
                  name: foodItem.name,
                  portion: foodItem.portion,
                  unit: foodItem.unit,
                  calories: foodItem.calories ?? null,
                  protein: foodItem.protein ?? null,
                  carbs: foodItem.carbs ?? null,
                  fat: foodItem.fat ?? null,
                  notes: foodItem.notes ?? null,
                  mealId: createdMeal.id,
                })),
              })
            }
          }
        }
      }

      const presetNutritionalPlanData =
        await tx.presetNutritionalPlan.findUnique({
          where: { id: presetNutritionalPlan.id },
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

      await createPresetNutritionalPlanTransaction({
        tx,
        type: TransactionType.PRESET_NUTRITIONAL_PLAN_CREATED,
        presetNutritionalPlanId: presetNutritionalPlan.id,
        performedById: user.id,
        facilityId: presetNutritionalPlan.facilityId,
        details: {
          action: "Plan nutricional preestablecido creado",
          attachmentId: presetNutritionalPlan.id,
          attachmentName: presetNutritionalPlan.name,
        },
      })

      await createNotification({
        tx,
        issuerId: user.id,
        facilityId: values.facilityId,
        type: NotificationType.PRESET_NUTRITIONAL_PLAN_CREATED,
        relatedId: presetNutritionalPlan.id,
      })

      revalidatePath(`/entrenamiento/planes-nutricionales-preestablecidos`)
      return { success: true, presetNutritionalPlan: presetNutritionalPlanData }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        error: "Error al crear el plan nutricional preestablecido",
      }
    }
  })
}

export async function updatePresetNutritionalPlan(
  id: string,
  values: NutritionalPlanValues,
): Promise<PresetNutritionalPlanResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      await tx.presetNutritionalPlan.update({
        where: { id },
        data: {
          name: values.name,
          description: values.description,
          facilityId: values.facilityId,
        },
      })

      const existingDailyMeals = await tx.dailyMeal.findMany({
        where: { presetNutritionalPlanId: id },
        include: {
          meals: {
            include: {
              foodItems: true,
            },
          },
        },
      })

      const daysOfWeek = Object.keys(values.dailyMeals) as DayOfWeek[]

      for (const day of daysOfWeek) {
        const meals = values.dailyMeals[day]
        const existingDailyMeal = existingDailyMeals.find(
          (dm) => dm.dayOfWeek === day,
        )

        if (meals.length > 0) {
          if (existingDailyMeal) {
            for (const meal of existingDailyMeal.meals) {
              await tx.foodItem.deleteMany({
                where: { mealId: meal.id },
              })
            }

            await tx.meal.deleteMany({
              where: { dailyMealId: existingDailyMeal.id },
            })

            for (const meal of meals) {
              const createdMeal = await tx.meal.create({
                data: {
                  mealType: meal.mealType,
                  time: meal.time ?? null,
                  dailyMealId: existingDailyMeal.id,
                },
              })

              if (meal.foodItems.length > 0) {
                await tx.foodItem.createMany({
                  data: meal.foodItems.map((foodItem) => ({
                    name: foodItem.name,
                    portion: foodItem.portion,
                    unit: foodItem.unit,
                    calories: foodItem.calories ?? null,
                    protein: foodItem.protein ?? null,
                    carbs: foodItem.carbs ?? null,
                    fat: foodItem.fat ?? null,
                    notes: foodItem.notes ?? null,
                    mealId: createdMeal.id,
                  })),
                })
              }
            }
          } else {
            const dailyMeal = await tx.dailyMeal.create({
              data: {
                dayOfWeek: day,
                presetNutritionalPlanId: id,
              },
            })

            for (const meal of meals) {
              const createdMeal = await tx.meal.create({
                data: {
                  mealType: meal.mealType,
                  time: meal.time ?? null,
                  dailyMealId: dailyMeal.id,
                },
              })

              if (meal.foodItems.length > 0) {
                await tx.foodItem.createMany({
                  data: meal.foodItems.map((foodItem) => ({
                    name: foodItem.name,
                    portion: foodItem.portion,
                    unit: foodItem.unit,
                    calories: foodItem.calories ?? null,
                    protein: foodItem.protein ?? null,
                    carbs: foodItem.carbs ?? null,
                    fat: foodItem.fat ?? null,
                    notes: foodItem.notes ?? null,
                    mealId: createdMeal.id,
                  })),
                })
              }
            }
          }
        } else if (existingDailyMeal) {
          await tx.dailyMeal.delete({
            where: { id: existingDailyMeal.id },
          })
        }
      }

      const presetNutritionalPlanData =
        await tx.presetNutritionalPlan.findUnique({
          where: { id },
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

      await createPresetNutritionalPlanTransaction({
        tx,
        type: TransactionType.PRESET_NUTRITIONAL_PLAN_UPDATED,
        presetNutritionalPlanId: id,
        performedById: user.id,
        facilityId: values.facilityId,
        details: {
          action: "Plan nutricional preestablecido actualizado",
          attachmentId: id,
          attachmentName: values.name,
        },
      })

      await createNotification({
        tx,
        issuerId: user.id,
        facilityId: values.facilityId,
        type: NotificationType.PRESET_NUTRITIONAL_PLAN_UPDATED,
        relatedId: id,
      })

      revalidatePath(`/entrenamiento/planes-nutricionales-preestablecidos`)
      return { success: true, presetNutritionalPlan: presetNutritionalPlanData }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        error: "Error al actualizar el plan nutricional preestablecido",
      }
    }
  })
}

export async function deletePresetNutritionalPlans(
  nutritionalPlanIds: string[],
  facilityId: string,
): Promise<DeleteEntityResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma
    .$transaction(
      async (tx) => {
        try {
          const presetNutritionalPlans =
            await tx.presetNutritionalPlan.findMany({
              where: {
                id: { in: nutritionalPlanIds },
              },
              select: {
                id: true,
                name: true,
              },
            })

          if (presetNutritionalPlans.length === 0) {
            return {
              success: false,
              message:
                "No se encontraron planes nutricionales preestablecidos para eliminar",
            }
          }

          for (const presetNutritionalPlan of presetNutritionalPlans) {
            await createPresetNutritionalPlanTransaction({
              tx,
              type: TransactionType.PRESET_NUTRITIONAL_PLAN_DELETED,
              presetNutritionalPlanId: presetNutritionalPlan.id,
              performedById: user.id,
              facilityId,
              details: {
                action: "Plan nutricional preestablecido borrado",
                attachmentId: presetNutritionalPlan.id,
                attachmentName: presetNutritionalPlan.name,
              },
            })
          }

          await createNotification({
            tx,
            issuerId: user.id,
            facilityId,
            type: NotificationType.PRESET_NUTRITIONAL_PLAN_DELETED,
          })

          const { count } = await tx.presetNutritionalPlan.deleteMany({
            where: {
              id: { in: nutritionalPlanIds },
            },
          })

          revalidatePath(`/entrenamiento/planes-nutricionales-preestablecidos`)

          return {
            success: true,
            message: `Se ${count === 1 ? "ha" : "han"} eliminado ${count} ${
              count === 1
                ? "plan nutricional preestablecido"
                : "planes nutricionales preestablecidos"
            } correctamente`,
            deletedCount: count,
          }
        } catch (error) {
          console.error("Error deleting preset nutritional plans:", error)
          throw error
        }
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000,
        timeout: 10000,
      },
    )
    .catch((error) => {
      console.error("Transaction failed:", error)
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al eliminar los planes nutricionales preestablecidos",
      }
    })
}

type ReplicationResult = {
  sourcePresetNutritionalPlan: NutritionalPlanData
  replicatedPresetNutritionalPlan: NutritionalPlanData | null
  targetFacilityId: string
}

export async function replicatePresetNutritionalPlans(
  presetNutritionalPlanIds: string[],
  targetFacilityIds: string[],
) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma
    .$transaction(
      async (tx) => {
        const presetNutritionalPlans = await tx.presetNutritionalPlan.findMany({
          where: {
            id: { in: presetNutritionalPlanIds },
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

        if (presetNutritionalPlans.length === 0) {
          return {
            success: false,
            message:
              "No se encontraron planes nutricionales preestablecidos para replicar",
          }
        }

        const targetFacilities = await tx.facility.findMany({
          where: {
            id: { in: targetFacilityIds },
          },
          select: {
            id: true,
            name: true,
            logoUrl: true,
          },
        })

        if (targetFacilities.length === 0) {
          return {
            success: false,
            message: "No se encontraron establecimientos destino",
          }
        }

        const replicationResults: ReplicationResult[] = []

        for (const targetFacility of targetFacilities) {
          for (const sourcePresetNutritionalPlan of presetNutritionalPlans) {
            try {
              const {
                id: sourceId,
                facilityId: sourceFacilityId,
                dailyMeals,
                ...presetNutritionalPlanData
              } = sourcePresetNutritionalPlan

              const replicatedPresetNutritionalPlan =
                await tx.presetNutritionalPlan.create({
                  data: {
                    ...presetNutritionalPlanData,
                    facilityId: targetFacility.id,
                  },
                })

              for (const dailyMeal of dailyMeals) {
                const { id: dailyMealId, meals, ...dailyMealData } = dailyMeal

                const newDailyMeal = await tx.dailyMeal.create({
                  data: {
                    ...dailyMealData,
                    presetNutritionalPlanId: replicatedPresetNutritionalPlan.id,
                  },
                })

                for (const meal of meals) {
                  const { id: mealId, foodItems, ...mealData } = meal

                  const newMeal = await tx.meal.create({
                    data: {
                      ...mealData,
                      dailyMealId: newDailyMeal.id,
                    },
                  })

                  for (const foodItem of foodItems) {
                    const { id: foodItemId, mealId, ...foodItemData } = foodItem

                    await tx.foodItem.create({
                      data: {
                        ...foodItemData,
                        mealId: newMeal.id,
                      },
                    })
                  }
                }
              }

              const completeReplicatedPresetNutritionalPlan =
                await tx.presetNutritionalPlan.findUnique({
                  where: { id: replicatedPresetNutritionalPlan.id },
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

              const transactionDetails = {
                action: "Plan nutricional preestablecido replicado",
                sourceId: sourceId,
                sourceName: sourcePresetNutritionalPlan.name,
                sourceFacilityId: sourceFacilityId,
                targetFacilityId: targetFacility.id,
                replicatedId: replicatedPresetNutritionalPlan.id,
                replicatedName: replicatedPresetNutritionalPlan.name,
                mealsCount: dailyMeals.reduce(
                  (count, dm) => count + dm.meals.length,
                  0,
                ),
                foodItemsCount: dailyMeals.reduce(
                  (count, dm) =>
                    count +
                    dm.meals.reduce(
                      (mealCount, meal) => mealCount + meal.foodItems.length,
                      0,
                    ),
                  0,
                ),
                targetFacilities: targetFacilities.map((facility) => ({
                  id: facility.id,
                  name: facility.name,
                  logoUrl: facility.logoUrl,
                })),
                timestamp: new Date().toISOString(),
              }

              await createPresetNutritionalPlanTransaction({
                tx,
                type: TransactionType.PRESET_NUTRITIONAL_PLAN_REPLICATED,
                presetNutritionalPlanId: sourceId,
                performedById: user.id,
                facilityId: sourceFacilityId,
                details: transactionDetails,
              })

              replicationResults.push({
                sourcePresetNutritionalPlan,
                replicatedPresetNutritionalPlan:
                  completeReplicatedPresetNutritionalPlan,
                targetFacilityId: targetFacility.id,
              })
            } catch (error) {
              console.error(
                `Error replicating preset nutritional plan ${sourcePresetNutritionalPlan.id} to facility ${targetFacility.id}:`,
                error,
              )
              throw error
            }
          }
        }

        await Promise.all(
          targetFacilityIds.map((facilityId) => {
            const relatedPresetNutritionalPlanId = replicationResults.find(
              (r) => r.targetFacilityId === facilityId,
            )?.replicatedPresetNutritionalPlan?.id

            return createNotification({
              tx,
              issuerId: user.id,
              facilityId,
              type: NotificationType.PRESET_NUTRITIONAL_PLAN_REPLICATED,
              relatedId: relatedPresetNutritionalPlanId,
            })
          }),
        )

        revalidatePath(`/entrenamiento/planes-nutricionales-preestablecidos`)
        return {
          success: true,
          message: `Se han replicado ${replicationResults.length} planes nutricionales preestablecidos en ${targetFacilities.length} establecimientos.`,
          replicatedCount: replicationResults.length,
          details: {
            replicatedPresetNutritionalPlans: replicationResults.map(
              (result) => ({
                sourceId: result.sourcePresetNutritionalPlan.id,
                sourceName: result.sourcePresetNutritionalPlan.name,
                replicatedId: result.replicatedPresetNutritionalPlan?.id,
                targetFacilityId: result.targetFacilityId,
                targetFacilityName: targetFacilities.find(
                  (f) => f.id === result.targetFacilityId,
                )?.name,
              }),
            ),
          },
        }
      },
      {
        timeout: 30000,
      },
    )
    .catch((error) => {
      console.error("Error replicating preset nutritional plans:", error)
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al replicar los planes nutricionales preestablecidos",
      }
    })
}
