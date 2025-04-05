/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { revalidatePath } from "next/cache"
import { cache } from "react"
import { notFound } from "next/navigation"

import type { PlanValues } from "@/lib/validation"
import prisma from "@/lib/prisma"
import { createNotification } from "@/lib/notificationHelpers"
import { NotificationType, Prisma, TransactionType } from "@prisma/client"
import { validateRequest } from "@/auth"
import type { PlanData } from "@/types/plan"
import type { DeleteEntityResult } from "@/lib/utils"
import { createPlanTransaction } from "@/lib/transactionHelpers"

type PlanResult = {
  success: boolean
  plan?: PlanData
  error?: string
}

export const getPlanById = cache(
  async (id: string): Promise<PlanValues & { id: string }> => {
    try {
      const plan = await prisma.plan.findUnique({
        where: { id },
        include: {
          diaryPlans: {
            include: {
              activity: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          facility: true,
        },
      })

      if (!plan) {
        notFound()
      }

      return {
        id: plan.id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        startDate: plan.startDate.toISOString(),
        endDate: plan.endDate.toISOString(),
        expirationPeriod: plan.expirationPeriod,
        generateInvoice: plan.generateInvoice,
        paymentTypes: plan.paymentTypes,
        planType: plan.planType,
        freeTest: plan.freeTest,
        current: plan.current,
        facilityId: plan.facilityId,
        diaryPlans: plan.diaryPlans.map((diaryPlan) => ({
          id: diaryPlan.id,
          name: diaryPlan.activity.name,
          daysOfWeek: diaryPlan.daysOfWeek,
          sessionsPerWeek: diaryPlan.sessionsPerWeek,
          vacancies: diaryPlan.vacancies,
          activityId: diaryPlan.activity.id,
        })),
      }
    } catch (error) {
      console.error("Error fetching plan:", error)
      throw new Error("Failed to fetch plan")
    }
  },
)

export async function createPlan(values: PlanValues): Promise<PlanResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      const plan = await tx.plan.create({
        data: {
          name: values.name,
          description: values.description,
          price: values.price,
          startDate: new Date(values.startDate),
          endDate: new Date(values.endDate),
          expirationPeriod: values.expirationPeriod,
          generateInvoice: values.generateInvoice,
          paymentTypes: values.paymentTypes,
          planType: values.planType,
          freeTest: values.freeTest,
          current: values.current,
          facilityId: values.facilityId,
          diaryPlans: {
            create:
              values.diaryPlans?.map((dp) => ({
                name: dp.name,
                daysOfWeek: dp.daysOfWeek,
                sessionsPerWeek: dp.sessionsPerWeek,
                vacancies: dp.vacancies,
                activityId: dp.activityId,
              })) || [],
          },
        },
      })

      await createPlanTransaction({
        tx,
        type: TransactionType.PLAN_CREATED,
        planId: plan.id,
        performedById: user.id,
        facilityId: plan.facilityId,
        details: {
          action: "Plan creado",
          attachmentId: plan.id,
          attachmentName: plan.name,
        },
      })

      await createNotification({
        tx,
        issuerId: user.id,
        facilityId: values.facilityId,
        type: NotificationType.PLAN_CREATED,
        relatedId: plan.id,
      })

      revalidatePath(`/planes`)
      return { success: true }
    } catch (error) {
      console.error(error)
      return { success: false, error: "Error al crear el plan" }
    }
  })
}

export async function updatePlan(
  id: string,
  values: PlanValues,
): Promise<PlanResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      const existingPlan = await tx.plan.findUnique({
        where: { id },
        include: {
          diaryPlans: {
            include: {
              userDiaries: {
                include: { attachments: true },
              },
            },
          },
        },
      })

      if (!existingPlan) {
        return { success: false, error: "Plan no encontrado" }
      }

      const existingDiaryPlanMap = new Map(
        existingPlan.diaryPlans.map((dp) => [dp.name, dp]),
      )

      const plan = await tx.plan.update({
        where: { id },
        data: {
          name: values.name,
          description: values.description,
          price: values.price,
          startDate: new Date(values.startDate),
          endDate: new Date(values.endDate),
          expirationPeriod: values.expirationPeriod,
          generateInvoice: values.generateInvoice,
          paymentTypes: values.paymentTypes,
          planType: values.planType,
          freeTest: values.freeTest,
          current: values.current,
          facilityId: values.facilityId,
        },
      })

      const affectedUserIds = new Set<string>()

      const processedDiaryPlanIds = new Set<string>()

      for (const newDp of values.diaryPlans || []) {
        const existingDp = existingDiaryPlanMap.get(newDp.name)

        if (existingDp) {
          await tx.diaryPlan.update({
            where: { id: existingDp.id },
            data: {
              daysOfWeek: newDp.daysOfWeek,
              sessionsPerWeek: newDp.sessionsPerWeek,
              vacancies: newDp.vacancies,
              activityId: newDp.activityId,
            },
          })

          processedDiaryPlanIds.add(existingDp.id)

          if (
            JSON.stringify(existingDp.daysOfWeek) !==
              JSON.stringify(newDp.daysOfWeek) ||
            existingDp.activityId !== newDp.activityId ||
            existingDp.sessionsPerWeek !== newDp.sessionsPerWeek
          ) {
            existingDp.userDiaries
              .filter((ud) => ud.isActive)
              .forEach((ud) => affectedUserIds.add(ud.userId))
          }
        } else {
          const newDiaryPlan = await tx.diaryPlan.create({
            data: {
              name: newDp.name,
              daysOfWeek: newDp.daysOfWeek,
              sessionsPerWeek: newDp.sessionsPerWeek,
              vacancies: newDp.vacancies,
              activityId: newDp.activityId,
              planId: id,
            },
          })

          processedDiaryPlanIds.add(newDiaryPlan.id)
        }
      }

      const diaryPlansToRemove = existingPlan.diaryPlans.filter(
        (dp) => !processedDiaryPlanIds.has(dp.id),
      )

      for (const dpToRemove of diaryPlansToRemove) {
        const activeUserDiaries = dpToRemove.userDiaries.filter(
          (ud) => ud.isActive,
        )

        if (activeUserDiaries.length > 0) {
          await tx.userDiary.updateMany({
            where: {
              diaryPlanId: dpToRemove.id,
              isActive: true,
            },
            data: {
              isActive: false,
              endDate: new Date(),
            },
          })

          activeUserDiaries.forEach((ud) => affectedUserIds.add(ud.userId))
        }

        await tx.diaryPlan.delete({
          where: { id: dpToRemove.id },
        })
      }

      await createPlanTransaction({
        tx,
        type: TransactionType.PLAN_UPDATED,
        planId: plan.id,
        performedById: user.id,
        facilityId: plan.facilityId,
        details: {
          action: "Plan actualizado",
          attachmentId: plan.id,
          attachmentName: plan.name,
          affectedUserCount: affectedUserIds.size,
          diaryPlansAdded:
            values.diaryPlans?.length -
            existingPlan.diaryPlans.length +
            diaryPlansToRemove.length,
          diaryPlansRemoved: diaryPlansToRemove.length,
        },
      })

      await createNotification({
        tx,
        issuerId: user.id,
        facilityId: values.facilityId,
        type: NotificationType.PLAN_UPDATED,
        relatedId: plan.id,
      })

      if (affectedUserIds.size > 0) {
        await createNotification({
          tx,
          issuerId: user.id,
          facilityId: values.facilityId,
          type: NotificationType.DIARY_PLAN_UPDATED,
          relatedId: plan.id,
          assignedUsers: Array.from(affectedUserIds),
        })
      }

      revalidatePath(`/planes`)
      return {
        success: true,
        affectedUserCount: affectedUserIds.size,
      }
    } catch (error) {
      console.error(error)
      return { success: false, error: "Error al editar el plan" }
    }
  })
}

export async function deletePlans(
  planIds: string[],
  facilityId: string,
): Promise<DeleteEntityResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  try {
    const plans = await prisma.plan.findMany({
      where: {
        id: { in: planIds },
      },
      select: {
        id: true,
        name: true,
      },
    })

    if (plans.length === 0) {
      return {
        success: false,
        message: "No se encontraron planes para eliminar",
      }
    }

    await prisma.diaryPlan.deleteMany({
      where: {
        planId: { in: planIds },
      },
    })

    for (const plan of plans) {
      await prisma.transaction.create({
        data: {
          type: "PLAN_DELETED",
          details: {
            action: "Plan borrado",
            attachmentId: plan.id,
            attachmentName: plan.name,
          },
          performedById: user.id,
          facilityId,
          planId: plan.id,
        },
      })
    }

    const facility = await prisma.facility.findUnique({
      where: { id: facilityId },
      include: { users: true },
    })

    if (facility) {
      const recipientUsers = facility.users.filter(
        (userFacility) => userFacility.userId !== user.id,
      )

      for (const userFacility of recipientUsers) {
        await prisma.notification.create({
          data: {
            recipientId: userFacility.userId,
            issuerId: user.id,
            facilityId,
            type: "PLAN_DELETED",
          },
        })
      }
    }

    const { count } = await prisma.plan.deleteMany({
      where: {
        id: { in: planIds },
      },
    })

    revalidatePath("/planes")

    return {
      success: true,
      message: `Se ${count === 1 ? "ha" : "han"} eliminado ${count} ${count === 1 ? "plan" : "planes"} correctamente`,
      deletedCount: count,
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Error al eliminar los planes"

    return {
      success: false,
      message: errorMessage,
    }
  }
}

export async function replicatePlans(
  planIds: string[],
  targetFacilityIds: string[],
) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma
    .$transaction(async (tx) => {
      const plans = await tx.plan.findMany({
        where: { id: { in: planIds } },
        select: {
          id: true,
          name: true,
          facilityId: true,
          description: true,
          price: true,
          startDate: true,
          endDate: true,
          expirationPeriod: true,
          generateInvoice: true,
          paymentTypes: true,
          planType: true,
          freeTest: true,
          current: true,
          diaryPlans: {
            select: {
              name: true,
              daysOfWeek: true,
              sessionsPerWeek: true,
              vacancies: true,
              activityId: true,
            },
          },
        },
      })

      if (plans.length === 0) {
        return {
          success: false,
          message: "No se encontraron planes para replicar",
        }
      }

      const targetFacilities = await tx.facility.findMany({
        where: { id: { in: targetFacilityIds } },
        select: {
          id: true,
          name: true,
          logoUrl: true,
        },
      })

      const replicationResults = await Promise.all(
        targetFacilityIds.flatMap(async (targetFacilityId) =>
          Promise.all(
            plans.map(async (sourcePlan) => {
              const {
                id: sourceId,
                facilityId: sourceFacilityId,
                diaryPlans,
                ...planData
              } = sourcePlan

              const replicatedPlan = await tx.plan.create({
                data: {
                  ...planData,
                  facilityId: targetFacilityId,
                  diaryPlans: {
                    create: diaryPlans,
                  },
                },
              })

              await createPlanTransaction({
                tx,
                type: TransactionType.PLAN_REPLICATED,
                planId: sourceId,
                performedById: user.id,
                facilityId: sourceFacilityId,
                details: {
                  action: "Plan replicado",
                  sourceId: sourceId,
                  sourceName: planData.name,
                  sourceFacilityId: sourceFacilityId,
                  targetFacilityId: targetFacilityId,
                  replicatedId: replicatedPlan.id,
                  replicatedName: replicatedPlan.name,
                  targetFacilities: targetFacilities.map((facility) => ({
                    id: facility.id,
                    name: facility.name,
                    logoUrl: facility.logoUrl,
                  })),
                },
              })

              return {
                sourcePlan,
                replicatedPlan,
                targetFacilityId,
              }
            }),
          ),
        ),
      )

      const flattenedResults = replicationResults.flat()

      await Promise.all(
        targetFacilityIds.map((facilityId) =>
          createNotification({
            tx,
            issuerId: user.id,
            facilityId,
            type: NotificationType.PLAN_REPLICATED,
          }),
        ),
      )

      revalidatePath(`/planes`)
      return {
        success: true,
        message: `Se han replicado ${flattenedResults.length} planes en ${targetFacilityIds.length} establecimientos.`,
        replicatedCount: flattenedResults.length,
        details: {
          replicatedPlans: flattenedResults.map((result) => ({
            sourceId: result.sourcePlan.id,
            sourceName: result.sourcePlan.name,
            replicatedId: result.replicatedPlan.id,
            targetFacilityId: result.targetFacilityId,
          })),
        },
      }
    })
    .catch((error) => {
      console.error("Error replicating plans:", error)
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al replicar los planes",
      }
    })
}

export async function assignPlanToUsers(
  planId: string,
  userIds: string[],
  facilityId: string,
) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      const plan = await tx.plan.findUnique({
        where: { id: planId },
        include: {
          diaryPlans: true,
        },
      })

      if (!plan) {
        return {
          success: false,
          message: "No se encontró el plan especificado",
        }
      }

      const existingUserPlans = await tx.userPlan.findMany({
        where: {
          userId: { in: userIds },
          isActive: true,
        },
        include: {
          plan: {
            select: {
              name: true,
              id: true,
              diaryPlans: {
                include: {
                  userDiaries: {
                    where: {
                      userId: { in: userIds },
                      isActive: true,
                    },
                  },
                },
              },
            },
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
        .filter((up) => up.planId !== planId)
        .map((up) => ({
          userId: up.userId,
          planId: up.planId,
          planName: up.plan.name,
        }))

      if (usersWithOtherPlans.length > 0) {
        const planIdsToUnassign = [
          ...new Set(usersWithOtherPlans.map((u) => u.planId)),
        ]
        const userIdsToUnassign = [
          ...new Set(usersWithOtherPlans.map((u) => u.userId)),
        ]

        for (const userPlan of existingUserPlans.filter(
          (up) =>
            planIdsToUnassign.includes(up.planId) &&
            userIdsToUnassign.includes(up.userId),
        )) {
          const diaryPlanIds = userPlan.plan.diaryPlans.map((dp) => dp.id)

          if (diaryPlanIds.length > 0) {
            await tx.userDiary.updateMany({
              where: {
                userId: userPlan.userId,
                diaryPlanId: { in: diaryPlanIds },
                isActive: true,
              },
              data: {
                isActive: false,
                endDate: new Date(),
              },
            })
          }
        }

        await tx.userPlan.updateMany({
          where: {
            userId: { in: userIdsToUnassign },
            planId: { in: planIdsToUnassign },
            isActive: true,
          },
          data: {
            isActive: false,
            endDate: new Date(),
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
            usersWithOtherPlans.find((u) => u.planId === planIdToUnassign)
              ?.planName || "Desconocido"
          const usersForThisPlan = usersWithOtherPlans.filter(
            (u) => u.planId === planIdToUnassign,
          )

          await createPlanTransaction({
            tx,
            type: TransactionType.UNASSIGN_PLAN_USER,
            planId: planIdToUnassign,
            performedById: user.id,
            facilityId,
            details: {
              action: "Plan desasignado de usuarios (reemplazo automático)",
              attachmentId: planIdToUnassign,
              attachmentName: planName,
              unassignedUsers: unassignedUsers.filter((u) =>
                usersForThisPlan.some((usr) => usr.userId === u.id),
              ),
              unassignedCount: usersForThisPlan.length,
              replacedByPlanId: planId,
              replacedByPlanName: plan.name,
            },
          })

          await createNotification({
            tx,
            issuerId: user.id,
            facilityId,
            type: NotificationType.UNASSIGN_PLAN_USER,
            relatedId: planIdToUnassign,
            assignedUsers: userIds,
          })
        }
      }

      const existingAssignments = existingUserPlans
        .filter((up) => up.planId === planId)
        .map((up) => up.userId)

      const newUserIds = userIds.filter(
        (id) => !existingAssignments.includes(id),
      )

      if (newUserIds.length > 0) {
        await tx.userPlan.createMany({
          data: newUserIds.map((userId) => ({
            userId,
            planId,
            isActive: true,
            startDate: new Date(),
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

      await createPlanTransaction({
        tx,
        type: TransactionType.ASSIGN_PLAN_USER,
        planId,
        performedById: user.id,
        facilityId,
        details: {
          action: "Plan asignado a usuarios",
          attachmentId: planId,
          attachmentName: plan.name,
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
        type: NotificationType.ASSIGN_PLAN_USER,
        relatedId: planId,
        assignedUsers: userIds,
      })

      revalidatePath("/planes")

      let message = `Plan asignado a ${newUserIds.length} usuarios correctamente`

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
      console.error("Error assigning plan to users:", error)
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al asignar el plan a los usuarios",
      }
    }
  })
}

export async function unassignPlanFromUsers(
  planId: string,
  userIds: string[],
  facilityId: string,
) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      const plan = await tx.plan.findUnique({
        where: { id: planId },
        include: {
          diaryPlans: true,
        },
      })

      if (!plan) {
        return {
          success: false,
          message: "No se encontró el plan especificado",
        }
      }

      const existingAssignments = await tx.userPlan.findMany({
        where: {
          planId,
          userId: { in: userIds },
          isActive: true,
        },
        select: { id: true, userId: true },
      })

      const existingUserIds = existingAssignments.map((a) => a.userId)

      if (existingUserIds.length === 0) {
        return {
          success: false,
          message: "No hay usuarios asignados a este plan para desasignar",
        }
      }

      const diaryPlanIds = plan.diaryPlans.map((dp) => dp.id)

      if (diaryPlanIds.length > 0) {
        const userDiaries = await tx.userDiary.findMany({
          where: {
            userId: { in: existingUserIds },
            diaryPlanId: { in: diaryPlanIds },
            isActive: true,
          },
          include: {
            attachments: true,
          },
        })

        if (userDiaries.length > 0) {
          await tx.userDiary.updateMany({
            where: {
              id: { in: userDiaries.map((ud) => ud.id) },
            },
            data: {
              isActive: false,
              endDate: new Date(),
            },
          })
        }
      }

      const { count } = await tx.userPlan.updateMany({
        where: {
          planId,
          userId: { in: existingUserIds },
          isActive: true,
        },
        data: {
          isActive: false,
          endDate: new Date(),
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

      await createPlanTransaction({
        tx,
        type: TransactionType.UNASSIGN_PLAN_USER,
        planId,
        performedById: user.id,
        facilityId,
        details: {
          action: "Plan desasignado de usuarios",
          attachmentId: planId,
          attachmentName: plan.name,
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
        type: NotificationType.UNASSIGN_PLAN_USER,
        relatedId: planId,
        assignedUsers: userIds,
      })

      revalidatePath("/planes")

      return {
        success: true,
        message: `Plan desasignado de ${count} ${count === 1 ? "usuario" : "usuarios"} correctamente`,
        unassignedCount: count,
      }
    } catch (error) {
      console.error("Error unassigning plan from users:", error)
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al desasignar el plan de los usuarios",
      }
    }
  })
}
