/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { revalidatePath } from "next/cache"
import { cache } from "react"
import { notFound } from "next/navigation"

import { ActivityValues } from "@/lib/validation"
import prisma from "@/lib/prisma"
import { createNotification } from "@/lib/notificationHelpers"
import { NotificationType, Prisma, TransactionType } from "@prisma/client"
import { validateRequest } from "@/auth"
import { ActivityData } from "@/types/activity"
import { DeleteEntityResult } from "@/lib/utils"
import { createActivityTransaction } from "@/lib/transactionHelpers"

type ActivityResult = {
  success: boolean
  activity?: ActivityData
  error?: string
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

      await createActivityTransaction({
        tx,
        type: TransactionType.ACTIVITY_CREATED,
        activityId: activity.id,
        performedById: user.id,
        facilityId: activity.facilityId,
        details: {
          action: "Actividad creada",
          attachmentId: activity.id,
          attachmentName: activity.name,
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

      await createActivityTransaction({
        tx,
        type: TransactionType.ACTIVITY_UPDATED,
        activityId: activity.id,
        performedById: user.id,
        facilityId: activity.facilityId,
        details: {
          action: "Actividad actualizada",
          attachmentId: activity.id,
          attachmentName: activity.name,
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
      return { success: false, error: "Error al editar la actividad" }
    })
}

export async function deleteActivities(
  activityIds: string[],
  facilityId: string,
): Promise<DeleteEntityResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma
    .$transaction(
      async (tx) => {
        try {
          const activities = await tx.activity.findMany({
            where: {
              id: { in: activityIds },
            },
            select: {
              id: true,
              name: true,
            },
          })

          if (activities.length === 0) {
            return {
              success: false,
              message: "No se encontraron actividades para eliminar",
            }
          }

          const diariesCount = await tx.diary.count({
            where: {
              activityId: { in: activityIds },
            },
          })

          for (const activity of activities) {
            await createActivityTransaction({
              tx,
              type: TransactionType.ACTIVITY_DELETED,
              activityId: activity.id,
              performedById: user.id,
              facilityId,
              details: {
                action: "Actividad borrada",
                attachmentId: activity.id,
                attachmentName: activity.name,
                deletedDiariesCount: diariesCount,
              },
            })
          }

          await createNotification(
            tx,
            user.id,
            facilityId,
            NotificationType.ACTIVITY_DELETED,
          )

          const { count } = await tx.activity.deleteMany({
            where: {
              id: { in: activityIds },
            },
          })

          revalidatePath("/actividades")

          return {
            success: true,
            message: `Se ${count === 1 ? "ha" : "han"} eliminado ${count} ${
              count === 1 ? "actividad" : "actividades"
            } y ${diariesCount} ${diariesCount === 1 ? "diario asociado" : "diarios asociados"} correctamente`,
            deletedCount: count,
            deletedDiariesCount: diariesCount,
          }
        } catch (error) {
          console.error("Error deleting activities:", error)
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
            : "Error al eliminar las actividades",
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
        select: {
          id: true,
          name: true,
          facilityId: true,
          description: true,
          price: true,
          isPublic: true,
          publicName: true,
          generateInvoice: true,
          maxSessions: true,
          mpAvailable: true,
          startDate: true,
          endDate: true,
          paymentType: true,
          activityType: true,
        },
      })

      if (activities.length === 0) {
        return {
          success: false,
          message: "No se encontraron actividades para replicar",
        }
      }

      const replicationResults = await Promise.all(
        targetFacilityIds.flatMap(async (targetFacilityId) =>
          Promise.all(
            activities.map(async (sourceActivity) => {
              const {
                id: sourceId,
                facilityId: sourceFacilityId,
                ...activityData
              } = sourceActivity

              const replicatedActivity = await tx.activity.create({
                data: {
                  ...activityData,
                  facilityId: targetFacilityId,
                },
              })

              await createActivityTransaction({
                tx,
                type: "ACTIVITY_REPLICATED",
                activityId: sourceId,
                performedById: user.id,
                facilityId: sourceFacilityId,
                details: {
                  action: "Actividad replicada",
                  sourceActivityId: sourceId,
                  sourceActivityName: activityData.name,
                  sourceFacilityId: sourceFacilityId,
                  targetFacilityId: targetFacilityId,
                  replicatedActivityId: replicatedActivity.id,
                  replicatedActivityName: replicatedActivity.name,
                },
              })

              return {
                sourceActivity,
                replicatedActivity,
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
            NotificationType.ACTIVITY_REPLICATED,
          ),
        ),
      )

      revalidatePath(`/actividades`)
      return {
        success: true,
        message: `Se han replicado ${flattenedResults.length} actividades en ${targetFacilityIds.length} establecimientos.`,
        replicatedCount: flattenedResults.length,
        details: {
          replicatedActivities: flattenedResults.map((result) => ({
            sourceId: result.sourceActivity.id,
            sourceName: result.sourceActivity.name,
            replicatedId: result.replicatedActivity.id,
            targetFacilityId: result.targetFacilityId,
          })),
        },
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
