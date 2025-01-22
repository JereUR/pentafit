/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { revalidatePath } from "next/cache"
import { cache } from "react"
import { notFound } from "next/navigation"

import { ActivityValues } from "@/lib/validation"
import prisma from "@/lib/prisma"

export const getActivityById = cache(
  async (id: string): Promise<ActivityValues & { id: string }> => {
    try {
      const activity = await prisma.activity.findUnique({
        where: { id },
      })

      if (!activity) {
        notFound()
      }

      return {
        id: activity.id,
        name: activity.name,
        description: activity.description || "",
        price: activity.price,
        isPublic: activity.isPublic,
        publicName: activity.publicName || "",
        generateInvoice: activity.generateInvoice,
        maxSessions: activity.maxSessions,
        mpAvailable: activity.mpAvailable,
        startDate: activity.startDate,
        endDate: activity.endDate,
        paymentType: activity.paymentType,
        activityType: activity.activityType,
        facilityId: activity.facilityId,
      }
    } catch (error) {
      console.error("Error fetching activity:", error)
      throw new Error("Failed to fetch activity")
    }
  },
)

export async function createActivity(values: ActivityValues) {
  try {
    const activity = await prisma.activity.create({
      data: {
        name: values.name,
        description: values.description ?? undefined,
        price: values.price,
        isPublic: values.isPublic,
        publicName: values.publicName ?? undefined,
        generateInvoice: values.generateInvoice,
        maxSessions: values.maxSessions,
        mpAvailable: values.mpAvailable,
        startDate: values.startDate,
        endDate: values.endDate,
        paymentType: values.paymentType,
        activityType: values.activityType,
        facilityId: values.facilityId,
      },
    })

    revalidatePath(`/actividades`)
    return { success: true, activity }
  } catch (error) {
    console.error(error)
    return { error: "Error al crear la actividad" }
  }
}

export async function updateActivity(id: string, values: ActivityValues) {
  try {
    const activity = await prisma.activity.update({
      where: { id },
      data: {
        name: values.name,
        description: values.description,
        price: values.price,
        isPublic: values.isPublic,
        publicName: values.publicName,
        generateInvoice: values.generateInvoice,
        maxSessions: values.maxSessions,
        mpAvailable: values.mpAvailable,
        startDate: values.startDate,
        endDate: values.endDate,
        paymentType: values.paymentType,
        activityType: values.activityType,
        facilityId: values.facilityId,
      },
    })

    revalidatePath(`/actividades`)
    return { success: true, activity }
  } catch (error) {
    console.error(error)
    return { error: "Error al actualizar la actividad" }
  }
}

export async function deleteActivities(activityIds: string[]) {
  try {
    const { count } = await prisma.activity.deleteMany({
      where: {
        id: { in: activityIds },
      },
    })

    if (count === 0) {
      throw new Error("No se encontraron actividades para eliminar")
    }

    return {
      success: true,
      message: `Se ${count === 1 ? "ha" : "han"} eliminado ${count} ${count === 1 ? "actividad" : "actividades"} correctamente`,
      deletedCount: count,
    }
  } catch (error) {
    console.error("Error deleting activities:", error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al eliminar las actividades",
    }
  }
}

export async function replicateActivities(
  activityIds: string[],
  targetFacilityIds: string[],
) {
  try {
    const activities = await prisma.activity.findMany({
      where: { id: { in: activityIds } },
    })

    const replicatedActivities = await Promise.all(
      targetFacilityIds.flatMap(async (facilityId) =>
        activities.map(async (activity) => {
          const {
            id,
            createdAt,
            updatedAt,
            facilityId: _,
            ...activityData
          } = activity
          return prisma.activity.create({
            data: {
              ...activityData,
              facilityId: facilityId,
            },
          })
        }),
      ),
    )

    const flattenedActivities = replicatedActivities.flat()

    revalidatePath(`/actividades`)
    return {
      success: true,
      message: `Se han replicado ${flattenedActivities.length} actividades en ${targetFacilityIds.length} establecimientos.`,
      replicatedCount: flattenedActivities.length,
    }
  } catch (error) {
    console.error("Error replicating activities:", error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al replicar las actividades",
    }
  }
}
