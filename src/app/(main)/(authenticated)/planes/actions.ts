/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { revalidatePath } from "next/cache"
import { cache } from "react"
import { notFound } from "next/navigation"

import { planSchema, PlanValues } from "@/lib/validation"
import prisma from "@/lib/prisma"
import { PlanData } from "@/types/plan"
import { validateRequest } from "@/auth"
import { createNotification } from "@/lib/notificationHelpers"
import { NotificationType } from "@prisma/client"
import { DeleteEntityResult } from "@/lib/utils"

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

export async function deletePlans(
  planIds: string[],
  facilityId: string,
): Promise<DeleteEntityResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      if (!planIds || planIds.length === 0) {
        return {
          success: false,
          message: "No se proporcionaron IDs de planes para eliminar",
        }
      }

      await tx.diaryPlan.deleteMany({
        where: {
          planId: { in: planIds },
        },
      })

      const { count } = await tx.plan.deleteMany({
        where: {
          id: { in: planIds },
        },
      })

      if (count === 0) {
        return {
          success: false,
          message: "No se encontraron planes para eliminar",
        }
      }

      await createNotification(
        tx,
        user.id,
        facilityId,
        NotificationType.PLAN_DELETED,
      )

      return {
        success: true,
        message: `Se ${count === 1 ? "ha" : "han"} eliminado ${count} ${
          count === 1 ? "plan" : "planes"
        } correctamente`,
        deletedCount: count,
      }
    } catch (error) {
      console.error("Error deleting plans:", error)
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al eliminar los planes",
      }
    }
  })
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
        include: {
          diaryPlans: true,
        },
      })

      const replicatedPlans = await Promise.all(
        targetFacilityIds.flatMap(async (facilityId) =>
          plans.map(async (plan) => {
            const { id, facilityId: _, ...planData } = plan
            return prisma.plan.create({
              data: {
                ...planData,
                facilityId: facilityId,
                diaryPlans: {
                  create: (plan.diaryPlans ?? []).map(
                    ({ id, planId, ...dpData }) => dpData,
                  ),
                },
              },
            })
          }),
        ),
      )

      const flattenedPlans = replicatedPlans.flat()

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
        message: `Se han replicado ${flattenedPlans.length} planes en ${targetFacilityIds.length} establecimientos.`,
        replicatedCount: flattenedPlans.length,
      }
    })
    .catch((error) => {
      console.error("Error replicating activities:", error)
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al replicar las actividades",
      }
    })
}
