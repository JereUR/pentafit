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

      await createNotification(
        tx,
        user.id,
        values.facilityId,
        NotificationType.PLAN_CREATED,
        plan.id,
      )

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
          diaryPlans: {
            deleteMany: {},
            create:
              values.diaryPlans?.map((dp) => ({
                name: dp.name,
                daysOfWeek: dp.daysOfWeek,
                sessionsPerWeek: dp.sessionsPerWeek,
                activityId: dp.activityId,
              })) || [],
          },
        },
      })

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
        },
      })

      await createNotification(
        tx,
        user.id,
        values.facilityId,
        NotificationType.PLAN_UPDATED,
        plan.id,
      )

      revalidatePath(`/planes`)
      return { success: true }
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
                  sourcePlanId: sourceId,
                  sourcePlanName: planData.name,
                  sourceFacilityId: sourceFacilityId,
                  targetFacilityId: targetFacilityId,
                  replicatedPlanId: replicatedPlan.id,
                  replicatedPlanName: replicatedPlan.name,
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
          createNotification(
            tx,
            user.id,
            facilityId,
            NotificationType.PLAN_REPLICATED,
          ),
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
