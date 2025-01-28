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
            select: {
              id: true,
              name: true,
              daysOfWeek: true,
              sessionsPerWeek: true,
              activity: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          facilities: {
            select: {
              facility: {
                select: {
                  id: true,
                  name: true,
                  logoUrl: true,
                },
              },
            },
          },
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
        facilities: plan.facilities.map((facility) => ({
          id: facility.facility.id,
          name: facility.facility.name,
          logoUrl: facility.facility.logoUrl || "",
        })),
        diaryPlans: plan.diaryPlans.map((diaryPlans) => ({
          id: diaryPlans.id,
          name: diaryPlans.name,
          daysOfWeek: diaryPlans.daysOfWeek,
          sessionsPerWeek: diaryPlans.sessionsPerWeek,
          activityId: diaryPlans.activity.id,
          activityName: diaryPlans.activity.name,
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
        facilities: {
          create: values.facilities.map((f) => ({ facilityId: f.id })),
        },
        diaryPlans: {
          create: values.diaryPlans,
        },
      },
      include: {
        facilities: {
          select: {
            facility: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
              },
            },
          },
        },
        diaryPlans: true,
      },
    })

    revalidatePath(`/planes`)
    return { success: true, plan }
  } catch (error) {
    console.error(error)
    return { error: "Error al crear el plan" }
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
        facilities: {
          deleteMany: {},
          create: values.facilities.map((f) => ({ facilityId: f.id })),
        },
        diaryPlans: {
          deleteMany: {},
          create: values.diaryPlans,
        },
      },
      include: {
        facilities: {
          select: {
            facility: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
              },
            },
          },
        },
        diaryPlans: true,
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
        facilities: true,
      },
    })

    const replicatedPlans = await Promise.all(
      plans.flatMap(async (plan) => {
        const { diaryPlans, ...planData } = plan
        return targetFacilityIds.map(async (facilityId) => {
          return prisma.plan.create({
            data: {
              ...planData,
              facilities: {
                create: [{ facilityId }],
              },
              diaryPlans: {
                create: diaryPlans.map(({ ...dpData }) => dpData),
              },
            },
          })
        })
      }),
    )

    const flattenedPlans = replicatedPlans.flat()

    revalidatePath(`/planes`)
    return {
      success: true,
      message: `Se han replicado ${flattenedPlans.length} planes en ${targetFacilityIds.length} establecimientos.`,
      replicatedCount: flattenedPlans.length,
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
