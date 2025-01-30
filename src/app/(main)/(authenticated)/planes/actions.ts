"use server"

import { revalidatePath } from "next/cache"
import { cache } from "react"
import { notFound } from "next/navigation"

import { PlanValues } from "@/lib/validation"
import prisma from "@/lib/prisma"

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
        startDate: plan.startDate,
        endDate: plan.endDate,
        expirationPeriod: plan.expirationPeriod,
        generateInvoice: plan.generateInvoice,
        paymentTypes: plan.paymentTypes,
        planType: plan.planType,
        freeTest: plan.freeTest,
        current: plan.current,
        diariesCount: plan.diariesCount,
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

export async function createPlan(values: PlanValues) {
  try {
    console.log("Creating plan with values:", values) // Debug log

    const sanitizedDiaryPlans = values.diaryPlans.map((plan) => ({
      ...plan,
      daysOfWeek: Array.isArray(plan.daysOfWeek)
        ? plan.daysOfWeek
        : [false, false, false, false, false, false, false],
    }))

    const plan = await prisma.plan.create({
      data: {
        name: values.name,
        description: values.description,
        price: values.price,
        startDate: values.startDate,
        endDate: values.endDate,
        expirationPeriod: values.expirationPeriod,
        generateInvoice: values.generateInvoice,
        paymentTypes: values.paymentTypes,
        planType: values.planType,
        freeTest: values.freeTest,
        current: values.current,
        diariesCount: values.diariesCount,
        facilityId: values.facilityId,
        diaryPlans: {
          create: sanitizedDiaryPlans.map((diaryPlan) => ({
            name: diaryPlan.name,
            daysOfWeek: diaryPlan.daysOfWeek,
            sessionsPerWeek: diaryPlan.sessionsPerWeek,
            activityId: diaryPlan.activityId,
          })),
        },
      },
      include: {
        facility: true,
        diaryPlans: {
          include: {
            activity: true,
          },
        },
      },
    })

    revalidatePath(`/planes`)
    return { success: true, plan }
  } catch (error) {
    console.error("Error creating plan:", error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Error al crear el plan" }
  }
}

export async function updatePlan(id: string, values: PlanValues) {
  try {
    const plan = await prisma.plan.update({
      where: { id },
      data: {
        name: values.name,
        description: values.description,
        price: values.price,
        startDate: values.startDate,
        endDate: values.endDate,
        expirationPeriod: values.expirationPeriod,
        generateInvoice: values.generateInvoice,
        paymentTypes: values.paymentTypes,
        planType: values.planType,
        freeTest: values.freeTest,
        current: values.current,
        diariesCount: values.diariesCount,
        facilityId: values.facilityId,
        diaryPlans: {
          deleteMany: {},
          create: values.diaryPlans.map((diaryPlan) => diaryPlan),
        },
      },
      include: {
        facility: true,
        diaryPlans: {
          include: {
            activity: true,
          },
        },
      },
    })

    revalidatePath(`/planes`)
    return { success: true, plan }
  } catch (error) {
    console.error(error)
    return { error: "Error al actualizar el plan" }
  }
}

export async function deletePlans(planIds: string[]) {
  try {
    const { count } = await prisma.plan.deleteMany({
      where: {
        id: { in: planIds },
      },
    })

    if (count === 0) {
      throw new Error("No se encontraron planes para eliminar")
    }

    revalidatePath(`/planes`)
    return {
      success: true,
      message: `Se ${count === 1 ? "ha" : "han"} eliminado ${count} ${count === 1 ? "plan" : "planes"} correctamente`,
      deletedCount: count,
    }
  } catch (error) {
    console.error("Error deleting plans:", error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error al eliminar los planes",
    }
  }
}

export async function replicatePlans(
  planIds: string[],
  targetFacilityIds: string[],
) {
  try {
    const plans = await prisma.plan.findMany({
      where: { id: { in: planIds } },
      include: {
        diaryPlans: true,
      },
    })

    const replicatedPlans = await Promise.all(
      plans.flatMap((plan) =>
        targetFacilityIds.map((facilityId) =>
          prisma.plan.create({
            data: {
              ...plan,
              id: undefined,
              facilityId,
              diaryPlans: {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                create: plan.diaryPlans.map(({ id, ...dpData }) => dpData),
              },
            },
          }),
        ),
      ),
    )

    revalidatePath(`/planes`)
    return {
      success: true,
      message: `Se han replicado ${replicatedPlans.length} planes en ${targetFacilityIds.length} establecimientos.`,
      replicatedCount: replicatedPlans.length,
    }
  } catch (error) {
    console.error("Error replicating plans:", error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error al replicar los planes",
    }
  }
}
