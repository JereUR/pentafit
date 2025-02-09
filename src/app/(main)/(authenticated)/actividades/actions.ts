/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { revalidatePath } from "next/cache"
import { cache } from "react"
import { notFound } from "next/navigation"

import { ActivityValues } from "@/lib/validation"
import prisma from "@/lib/prisma"
import { createNotification } from "@/lib/notificationHelpers"
import { NotificationType } from "@prisma/client"
import { validateRequest } from "@/auth"

type ActivityResult = {
  success: boolean
  activity?: {
    id: string
    name: string
    description: string | null
    price: number
    isPublic: boolean
    publicName: string | null
    generateInvoice: boolean
    maxSessions: number
    mpAvailable: boolean
    startDate: Date
    endDate: Date
    paymentType: string
    activityType: string
    facilityId: string
    createdAt: Date
    updatedAt: Date
  }
  error?: string
}

type DeleteActivityResult = {
  success: boolean
  message: string
  deletedCount?: number
}

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

export async function createActivity(
  values: ActivityValues,
): Promise<ActivityResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      const activity = await tx.activity.create({
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

      await createNotification(
        tx,
        user.id,
        values.facilityId,
        NotificationType.ACTIVITY_CREATED,
        activity.id,
      )

      revalidatePath(`/actividades`)
      return { success: true, activity }
    } catch (error) {
      console.error(error)
      return { success: false, error: "Error al crear la actividad" }
    }
  })
}

export async function updateActivity(
  id: string,
  values: ActivityValues,
): Promise<ActivityResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma
    .$transaction(async (tx) => {
      const activity = await tx.activity.update({
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

      await createNotification(
        tx,
        user.id,
        values.facilityId,
        NotificationType.ACTIVITY_UPDATED,
        activity.id,
      )

      revalidatePath(`/actividades`)
      return { success: true, activity }
    })
    .catch((error) => {
      console.error(error)
      return { success: false, error: "Error al crear la actividad" }
    })
}

export async function deleteActivities(
  activityIds: string[],
  facilityId: string,
): Promise<DeleteActivityResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      const { count } = await tx.activity.deleteMany({
        where: {
          id: { in: activityIds },
        },
      })

      if (count === 0) {
        return {
          success: false,
          message: "No se encontraron actividades para eliminar",
        }
      }

      await createNotification(
        tx,
        user.id,
        facilityId,
        NotificationType.ACTIVITY_DELETED,
      )

      revalidatePath(`/actividades`)
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
  })
}

export async function replicateActivities(
  activityIds: string[],
  targetFacilityIds: string[],
) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma
    .$transaction(async (tx) => {
      const activities = await tx.activity.findMany({
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
            return tx.activity.create({
              data: {
                ...activityData,
                facilityId: facilityId,
              },
            })
          }),
        ),
      )

      const flattenedActivities = replicatedActivities.flat()

      await Promise.all(
        targetFacilityIds.map((facilityId) =>
          createNotification(
            tx,
            user.id,
            facilityId,
            NotificationType.ACTIVITY_REPLICATED,
          ),
        ),
      )

      revalidatePath(`/actividades`)
      return {
        success: true,
        message: `Se han replicado ${flattenedActivities.length} actividades en ${targetFacilityIds.length} establecimientos.`,
        replicatedCount: flattenedActivities.length,
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
