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
import { createNutritionalPlanTransaction } from "@/lib/transactionHelpers"
import { NutritionalPlanData } from "@/types/nutritionalPlans"
import { DailyMealsValues, NutritionalPlanValues } from "@/lib/validation"
import { createClientNotification } from "@/lib/clientNotificationHelpers"

type NutritionalPlanResult = {
  success: boolean
  nutritionalPlan?: NutritionalPlanData | null
  error?: string
}

export const getNutritionalPlanById = cache(
  async (id: string): Promise<NutritionalPlanValues & { id: string }> => {
    try {
      const nutritionalPlan = await prisma.nutritionalPlan.findUnique({
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

      if (!nutritionalPlan) {
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

      nutritionalPlan.dailyMeals.forEach((dailyMeal) => {
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
        id: nutritionalPlan.id,
        name: nutritionalPlan.name,
        description: nutritionalPlan.description || "",
        facilityId: nutritionalPlan.facilityId,
        dailyMeals,
      }
    } catch (error) {
      console.error("Error fetching nutritional plan:", error)
      throw new Error("Failed to fetch nutritional plan")
    }
  },
)

export async function createNutritionalPlan(
  values: NutritionalPlanValues,
): Promise<NutritionalPlanResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      const nutritionalPlan = await tx.nutritionalPlan.create({
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
              nutritionalPlanId: nutritionalPlan.id,
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

      const nutritionalPlanData = await tx.nutritionalPlan.findUnique({
        where: { id: nutritionalPlan.id },
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

      await createNutritionalPlanTransaction({
        tx,
        type: TransactionType.NUTRITIONAL_PLAN_CREATED,
        nutritionalPlanId: nutritionalPlan.id,
        performedById: user.id,
        facilityId: nutritionalPlan.facilityId,
        details: {
          action: "Plan nutricional creado",
          attachmentId: nutritionalPlan.id,
          attachmentName: nutritionalPlan.name,
        },
      })

      await createNotification({
        tx,
        issuerId: user.id,
        facilityId: values.facilityId,
        type: NotificationType.NUTRITIONAL_PLAN_CREATED,
        relatedId: nutritionalPlan.id,
      })

      revalidatePath(`/entrenamiento/planes-nutricionales`)
      return { success: true, nutritionalPlan: nutritionalPlanData }
    } catch (error) {
      console.error(error)
      return { success: false, error: "Error al crear el plan nutricional" }
    }
  })
}

export async function updateNutritionalPlan(
  id: string,
  values: NutritionalPlanValues,
): Promise<NutritionalPlanResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      await tx.nutritionalPlan.update({
        where: { id },
        data: {
          name: values.name,
          description: values.description,
          facilityId: values.facilityId,
        },
      })

      const existingDailyMeals = await tx.dailyMeal.findMany({
        where: { nutritionalPlanId: id },
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
                nutritionalPlanId: id,
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

      const nutritionalPlanData = await tx.nutritionalPlan.findUnique({
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

      await createNutritionalPlanTransaction({
        tx,
        type: TransactionType.NUTRITIONAL_PLAN_UPDATED,
        nutritionalPlanId: id,
        performedById: user.id,
        facilityId: values.facilityId,
        details: {
          action: "Plan nutricional actualizado",
          attachmentId: id,
          attachmentName: values.name,
        },
      })

      await createNotification({
        tx,
        issuerId: user.id,
        facilityId: values.facilityId,
        type: NotificationType.NUTRITIONAL_PLAN_UPDATED,
        relatedId: id,
      })

      revalidatePath(`/entrenamiento/planes-nutricionales`)
      return { success: true, nutritionalPlan: nutritionalPlanData }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        error: "Error al actualizar el plan nutricional",
      }
    }
  })
}

export async function deleteNutritionalPlans(
  nutritionalPlanIds: string[],
  facilityId: string,
): Promise<DeleteEntityResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma
    .$transaction(
      async (tx) => {
        try {
          const nutritionalPlans = await tx.nutritionalPlan.findMany({
            where: {
              id: { in: nutritionalPlanIds },
            },
            select: {
              id: true,
              name: true,
            },
          })

          if (nutritionalPlans.length === 0) {
            return {
              success: false,
              message: "No se encontraron planes nutricionales para eliminar",
            }
          }

          const userNutritionalPlansCount = await tx.userNutritionalPlan.count({
            where: {
              nutritionalPlanId: { in: nutritionalPlanIds },
            },
          })

          for (const nutritionalPlan of nutritionalPlans) {
            await createNutritionalPlanTransaction({
              tx,
              type: TransactionType.NUTRITIONAL_PLAN_DELETED,
              nutritionalPlanId: nutritionalPlan.id,
              performedById: user.id,
              facilityId,
              details: {
                action: "Plan nutricional borrado",
                attachmentId: nutritionalPlan.id,
                attachmentName: nutritionalPlan.name,
                affectedUserNutritionalPlansCount: userNutritionalPlansCount,
              },
            })
          }

          await createNotification({
            tx,
            issuerId: user.id,
            facilityId,
            type: NotificationType.NUTRITIONAL_PLAN_DELETED,
          })

          await tx.userNutritionalPlan.deleteMany({
            where: {
              nutritionalPlanId: { in: nutritionalPlanIds },
            },
          })

          const { count } = await tx.nutritionalPlan.deleteMany({
            where: {
              id: { in: nutritionalPlanIds },
            },
          })

          revalidatePath(`/entrenamiento/planes-nutricionales`)

          return {
            success: true,
            message: `Se ${count === 1 ? "ha" : "han"} eliminado ${count} ${
              count === 1 ? "plan nutricional" : "planes nutricionales"
            } y ${userNutritionalPlansCount} ${userNutritionalPlansCount === 1 ? "asignación de usuario" : "asignaciones de usuarios"} correctamente`,
            deletedCount: count,
            affectedUserNutritionalPlansCount: userNutritionalPlansCount,
          }
        } catch (error) {
          console.error("Error deleting nutritional plans:", error)
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
            : "Error al eliminar los planes nutricionales",
      }
    })
}

type ReplicationResult = {
  sourceNutritionalPlan: NutritionalPlanData
  replicatedNutritionalPlan: NutritionalPlanData | null
  targetFacilityId: string
}

export async function replicateNutritionalPlans(
  nutritionalPlanIds: string[],
  targetFacilityIds: string[],
) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma
    .$transaction(
      async (tx) => {
        const nutritionalPlans = await tx.nutritionalPlan.findMany({
          where: {
            id: { in: nutritionalPlanIds },
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

        if (nutritionalPlans.length === 0) {
          return {
            success: false,
            message: "No se encontraron planes nutricionales para replicar",
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
          for (const sourceNutritionalPlan of nutritionalPlans) {
            try {
              const {
                id: sourceId,
                facilityId: sourceFacilityId,
                dailyMeals,
                ...nutritionalPlanData
              } = sourceNutritionalPlan

              const replicatedNutritionalPlan = await tx.nutritionalPlan.create(
                {
                  data: {
                    ...nutritionalPlanData,
                    facilityId: targetFacility.id,
                  },
                },
              )

              for (const dailyMeal of dailyMeals) {
                const { id: dailyMealId, meals, ...dailyMealData } = dailyMeal

                const newDailyMeal = await tx.dailyMeal.create({
                  data: {
                    ...dailyMealData,
                    nutritionalPlanId: replicatedNutritionalPlan.id,
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

              const completeReplicatedNutritionalPlan =
                await tx.nutritionalPlan.findUnique({
                  where: { id: replicatedNutritionalPlan.id },
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
                action: "Plan nutricional replicado",
                sourceId: sourceId,
                sourceName: sourceNutritionalPlan.name,
                sourceFacilityId: sourceFacilityId,
                targetFacilityId: targetFacility.id,
                replicatedId: replicatedNutritionalPlan.id,
                replicatedName: replicatedNutritionalPlan.name,
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

              await createNutritionalPlanTransaction({
                tx,
                type: TransactionType.NUTRITIONAL_PLAN_REPLICATED,
                nutritionalPlanId: sourceId,
                performedById: user.id,
                facilityId: sourceFacilityId,
                details: transactionDetails,
              })

              replicationResults.push({
                sourceNutritionalPlan,
                replicatedNutritionalPlan: completeReplicatedNutritionalPlan,
                targetFacilityId: targetFacility.id,
              })
            } catch (error) {
              console.error(
                `Error replicating nutritional plan ${sourceNutritionalPlan.id} to facility ${targetFacility.id}:`,
                error,
              )
              throw error
            }
          }
        }

        await Promise.all(
          targetFacilityIds.map((facilityId) => {
            const relatedNutritionalPlanId = replicationResults.find(
              (r) => r.targetFacilityId === facilityId,
            )?.replicatedNutritionalPlan?.id

            return createNotification({
              tx,
              issuerId: user.id,
              facilityId,
              type: NotificationType.NUTRITIONAL_PLAN_REPLICATED,
              relatedId: relatedNutritionalPlanId,
            })
          }),
        )

        revalidatePath(`/entrenamiento/planes-nutricionales`)
        return {
          success: true,
          message: `Se han replicado ${replicationResults.length} planes nutricionales en ${targetFacilities.length} establecimientos.`,
          replicatedCount: replicationResults.length,
          details: {
            replicatedNutritionalPlans: replicationResults.map((result) => ({
              sourceId: result.sourceNutritionalPlan.id,
              sourceName: result.sourceNutritionalPlan.name,
              replicatedId: result.replicatedNutritionalPlan?.id,
              targetFacilityId: result.targetFacilityId,
              targetFacilityName: targetFacilities.find(
                (f) => f.id === result.targetFacilityId,
              )?.name,
            })),
          },
        }
      },
      {
        timeout: 30000,
      },
    )
    .catch((error) => {
      console.error("Error replicating nutritional plans:", error)
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al replicar los planes nutricionales",
      }
    })
}

export async function assignNutritionalPlanToUsers(
  nutritionalPlanId: string,
  userIds: string[],
  facilityId: string,
) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      const nutritionalPlan = await tx.nutritionalPlan.findUnique({
        where: { id: nutritionalPlanId },
        select: { id: true, name: true },
      })

      if (!nutritionalPlan) {
        return {
          success: false,
          message: "No se encontró el plan nutricional especificado",
        }
      }

      const existingUserPlans = await tx.userNutritionalPlan.findMany({
        where: {
          userId: { in: userIds },
          isActive: true,
        },
        include: {
          nutritionalPlan: {
            select: { name: true },
          },
        },
      })

      const userPlansMap = existingUserPlans.reduce(
        (acc, up) => {
          if (!acc[up.userId]) {
            acc[up.userId] = []
          }
          acc[up.userId].push(up)
          return acc
        },
        {} as Record<string, typeof existingUserPlans>,
      )

      const usersWithOtherPlans = existingUserPlans
        .filter((up) => up.nutritionalPlanId !== nutritionalPlanId)
        .map((up) => ({
          userId: up.userId,
          nutritionalPlanId: up.nutritionalPlanId,
          nutritionalPlanName: up.nutritionalPlan.name,
        }))

      if (usersWithOtherPlans.length > 0) {
        const planIdsToUnassign = [
          ...new Set(usersWithOtherPlans.map((u) => u.nutritionalPlanId)),
        ]
        const userIdsToUnassign = [
          ...new Set(usersWithOtherPlans.map((u) => u.userId)),
        ]

        await tx.userNutritionalPlan.deleteMany({
          where: {
            userId: { in: userIdsToUnassign },
            nutritionalPlanId: { in: planIdsToUnassign },
          },
        })

        const unassignedUsers = await tx.user.findMany({
          where: { id: { in: userIdsToUnassign } },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            email: true,
          },
        })

        for (const planIdToUnassign of planIdsToUnassign) {
          const planName =
            usersWithOtherPlans.find(
              (u) => u.nutritionalPlanId === planIdToUnassign,
            )?.nutritionalPlanName || "Desconocido"
          const usersForThisPlan = usersWithOtherPlans.filter(
            (u) => u.nutritionalPlanId === planIdToUnassign,
          )

          await createNutritionalPlanTransaction({
            tx,
            type: TransactionType.UNASSIGN_NUTRITIONAL_PLAN_USER,
            nutritionalPlanId: planIdToUnassign,
            performedById: user.id,
            facilityId,
            details: {
              action:
                "Plan nutricional desasignado de usuarios (reemplazo automático)",
              attachmentId: planIdToUnassign,
              attachmentName: planName,
              unassignedUsers: unassignedUsers.filter((u) =>
                usersForThisPlan.some((usr) => usr.userId === u.id),
              ),
              unassignedCount: usersForThisPlan.length,
              replacedByPlanId: nutritionalPlanId,
              replacedByPlanName: nutritionalPlan.name,
            },
          })

          await createNotification({
            tx,
            issuerId: user.id,
            facilityId,
            type: NotificationType.UNASSIGN_NUTRITIONAL_PLAN_USER,
            relatedId: planIdToUnassign,
            assignedUsers: userIds,
          })

          for (const userId of userIdsToUnassign) {
            await createClientNotification({
              tx,
              recipientId: userId,
              issuerId: user.id,
              facilityId,
              type: NotificationType.UNASSIGN_NUTRITIONAL_PLAN_USER,
              relatedId: planIdToUnassign,
              entityName: planName,
              endDate: new Date(),
            })
          }
        }
      }

      const existingAssignments = existingUserPlans
        .filter((up) => up.nutritionalPlanId === nutritionalPlanId)
        .map((up) => up.userId)

      const newUserIds = userIds.filter(
        (id) => !existingAssignments.includes(id),
      )

      if (newUserIds.length > 0) {
        await tx.userNutritionalPlan.createMany({
          data: newUserIds.map((userId) => ({
            userId,
            nutritionalPlanId,
            isActive: true,
          })),
          skipDuplicates: true,
        })
      }

      const users = await tx.user.findMany({
        where: { id: { in: newUserIds } },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          email: true,
        },
      })

      await createNutritionalPlanTransaction({
        tx,
        type: TransactionType.ASSIGN_NUTRITIONAL_PLAN_USER,
        nutritionalPlanId,
        performedById: user.id,
        facilityId,
        details: {
          action: "Plan nutricional asignado a usuarios",
          attachmentId: nutritionalPlanId,
          attachmentName: nutritionalPlan.name,
          assignedUsers: users.map((u) => ({
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            avatarUrl: u.avatarUrl,
            email: u.email,
          })),
          assignedCount: newUserIds.length,
          alreadyAssignedCount: existingAssignments.length,
          replacedPlansCount: usersWithOtherPlans.length,
        },
      })

      await createNotification({
        tx,
        issuerId: user.id,
        facilityId,
        type: NotificationType.ASSIGN_NUTRITIONAL_PLAN_USER,
        relatedId: nutritionalPlanId,
        assignedUsers: userIds,
      })

      for (const userId of userIds) {
        const replacedPlan = usersWithOtherPlans.find(
          (u) => u.userId === userId,
        )

        await createClientNotification({
          tx,
          recipientId: userId,
          issuerId: user.id,
          facilityId,
          type: NotificationType.ASSIGN_NUTRITIONAL_PLAN_USER,
          relatedId: nutritionalPlanId,
          entityName: nutritionalPlan.name,
          startDate: new Date(),
          replacedEntityName: replacedPlan?.nutritionalPlanName,
        })
      }

      revalidatePath("/entrenamiento/planes-nutricionales")

      let message = `Plan nutricional asignado a ${newUserIds.length} usuarios correctamente`

      if (existingAssignments.length > 0) {
        message += ` (${existingAssignments.length} ya estaban asignados)`
      }

      if (usersWithOtherPlans.length > 0) {
        message += `. Se reemplazaron ${usersWithOtherPlans.length} asignaciones previas`
      }

      return {
        success: true,
        message,
        assignedCount: newUserIds.length,
        alreadyAssignedCount: existingAssignments.length,
        replacedPlansCount: usersWithOtherPlans.length,
      }
    } catch (error) {
      console.error("Error assigning nutritional plan to users:", error)
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al asignar el plan nutricional a los usuarios",
      }
    }
  })
}

export async function unassignNutritionalPlanFromUsers(
  nutritionalPlanId: string,
  userIds: string[],
  facilityId: string,
) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      const nutritionalPlan = await tx.nutritionalPlan.findUnique({
        where: { id: nutritionalPlanId },
        select: { id: true, name: true },
      })

      if (!nutritionalPlan) {
        return {
          success: false,
          message: "No se encontró el plan nutricional especificado",
        }
      }

      const existingAssignments = await tx.userNutritionalPlan.findMany({
        where: {
          nutritionalPlanId,
          userId: { in: userIds },
        },
        select: { userId: true },
      })

      const existingUserIds = existingAssignments.map((a) => a.userId)

      if (existingUserIds.length === 0) {
        return {
          success: false,
          message:
            "No hay usuarios asignados a este plan nutricional para desasignar",
        }
      }

      const { count } = await tx.userNutritionalPlan.deleteMany({
        where: {
          nutritionalPlanId,
          userId: { in: existingUserIds },
        },
      })

      const users = await tx.user.findMany({
        where: { id: { in: existingUserIds } },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          email: true,
        },
      })

      await createNutritionalPlanTransaction({
        tx,
        type: TransactionType.UNASSIGN_NUTRITIONAL_PLAN_USER,
        nutritionalPlanId,
        performedById: user.id,
        facilityId,
        details: {
          action: "Plan nutricional desasignado de usuarios",
          attachmentId: nutritionalPlanId,
          attachmentName: nutritionalPlan.name,
          unassignedUsers: users.map((u) => ({
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            avatarUrl: u.avatarUrl,
            email: u.email,
          })),
          unassignedCount: count,
        },
      })

      await createNotification({
        tx,
        issuerId: user.id,
        facilityId,
        type: NotificationType.UNASSIGN_NUTRITIONAL_PLAN_USER,
        relatedId: nutritionalPlanId,
        assignedUsers: userIds,
      })

      for (const userId of existingUserIds) {
        await createClientNotification({
          tx,
          recipientId: userId,
          issuerId: user.id,
          facilityId,
          type: NotificationType.UNASSIGN_NUTRITIONAL_PLAN_USER,
          relatedId: nutritionalPlanId,
          entityName: nutritionalPlan.name,
          endDate: new Date(),
        })
      }

      revalidatePath("/entrenamiento/planes-nutricionales")

      return {
        success: true,
        message: `Plan nutricional desasignado de ${count} ${count === 1 ? "usuario" : "usuarios"} correctamente`,
        unassignedCount: count,
      }
    } catch (error) {
      console.error("Error unassigning nutritional plan from users:", error)
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al desasignar el plan nutricional de los usuarios",
      }
    }
  })
}

export async function convertToPresetNutritionalPlan(
  nutritionalPlanId: string,
  facilityId: string,
) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      const sourceNutritionalPlan = await tx.nutritionalPlan.findUnique({
        where: { id: nutritionalPlanId },
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

      if (!sourceNutritionalPlan) {
        return {
          success: false,
          message: "No se encontró el plan nutricional especificado",
        }
      }

      const presetNutritionalPlan = await tx.presetNutritionalPlan.create({
        data: {
          name: `${sourceNutritionalPlan.name} (Preestablecido)`,
          description: sourceNutritionalPlan.description,
          facilityId: sourceNutritionalPlan.facilityId,
        },
      })

      for (const dailyMeal of sourceNutritionalPlan.dailyMeals) {
        const newDailyMeal = await tx.dailyMeal.create({
          data: {
            dayOfWeek: dailyMeal.dayOfWeek,
            presetNutritionalPlanId: presetNutritionalPlan.id,
          },
        })

        for (const meal of dailyMeal.meals) {
          const newMeal = await tx.meal.create({
            data: {
              mealType: meal.mealType,
              time: meal.time,
              dailyMealId: newDailyMeal.id,
            },
          })

          if (meal.foodItems.length > 0) {
            await tx.foodItem.createMany({
              data: meal.foodItems.map((item) => ({
                name: item.name,
                portion: item.portion,
                unit: item.unit,
                calories: item.calories,
                protein: item.protein,
                carbs: item.carbs,
                fat: item.fat,
                notes: item.notes,
                mealId: newMeal.id,
              })),
            })
          }
        }
      }

      const totalMeals = sourceNutritionalPlan.dailyMeals.reduce(
        (count, dm) => count + dm.meals.length,
        0,
      )

      const totalFoodItems = sourceNutritionalPlan.dailyMeals.reduce(
        (count, dm) =>
          count +
          dm.meals.reduce(
            (mealCount, meal) => mealCount + meal.foodItems.length,
            0,
          ),
        0,
      )

      const transactionDetails = {
        action: "Plan nutricional convertido a preestablecido",
        attachmentId: nutritionalPlanId,
        attachmentName: sourceNutritionalPlan.name,
        presetNutritionalPlanId: presetNutritionalPlan.id,
        presetNutritionalPlanName: presetNutritionalPlan.name,
        mealsCount: totalMeals,
        foodItemsCount: totalFoodItems,
        timestamp: new Date().toISOString(),
      }

      await createNutritionalPlanTransaction({
        tx,
        type: TransactionType.NUTRITIONAL_PLAN_CONVERTED_TO_PRESET,
        nutritionalPlanId: nutritionalPlanId,
        performedById: user.id,
        facilityId: facilityId,
        details: transactionDetails,
      })

      /* await createNotification({
        tx,
        issuerId: user.id,
        facilityId: facilityId,
        type: NotificationType.NUTRITIONAL_PLAN_CONVERTED_TO_PRESET,
        relatedId: presetNutritionalPlan.id,
      }) */

      revalidatePath("/entrenamiento/planes-nutricionales")
      revalidatePath("/entrenamiento/planes-nutricionales-preestablecidos")

      return {
        success: true,
        message: `Plan nutricional "${sourceNutritionalPlan.name}" convertido a preestablecido correctamente`,
        sourceNutritionalPlanId: nutritionalPlanId,
        presetNutritionalPlanId: presetNutritionalPlan.id,
      }
    } catch (error) {
      console.error("Error converting nutritional plan to preset:", error)
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al convertir el plan nutricional a preestablecido",
      }
    }
  })
}
