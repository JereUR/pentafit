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
import { ActivityData, StaffMember } from "@/types/activity"
import { DeleteEntityResult } from "@/lib/utils"
import { createActivityTransaction } from "@/lib/transactionHelpers"

type ActivityResult = {
  success: boolean
  activity?: ActivityData
  error?: string
}

export const getActivityById = cache(
  async (
    id: string,
  ): Promise<
    ActivityValues & {
      id: string
      staffIds?: string[]
      staffMembers?: StaffMember[]
    }
  > => {
    try {
      const activity = await prisma.activity.findUnique({
        where: { id },
        include: {
          staffMembers: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
      })

      if (!activity) {
        notFound()
      }

      const staffMembers = activity.staffMembers.map(
        (staff) => staff.user,
      ) as StaffMember[]
      const staffIds = staffMembers.map((staff) => staff.id)

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
        staffIds,
        staffMembers,
      }
    } catch (error) {
      console.error("Error fetching activity:", error)
      throw new Error("Failed to fetch activity")
    }
  },
)

export async function getStaffForFacility(
  facilityId: string,
): Promise<StaffMember[]> {
  try {
    const staffMembers = await prisma.user.findMany({
      where: {
        role: "STAFF",
        facilities: {
          some: {
            facilityId,
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatarUrl: true,
      },
    })

    return staffMembers
  } catch (error) {
    console.error("Error fetching staff members:", error)
    throw new Error("Failed to fetch staff members")
  }
}

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

      if (values.staffIds && values.staffIds.length > 0) {
        await tx.activityStaff.createMany({
          data: values.staffIds.map((userId) => ({
            activityId: activity.id,
            userId,
          })),
        })
      }

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

      await createNotification({
        tx,
        issuerId: user.id,
        facilityId: values.facilityId,
        type: NotificationType.ACTIVITY_CREATED,
        relatedId: activity.id,
      })

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

      await tx.activityStaff.deleteMany({
        where: { activityId: id },
      })

      if (values.staffIds && values.staffIds.length > 0) {
        await tx.activityStaff.createMany({
          data: values.staffIds.map((userId) => ({
            activityId: activity.id,
            userId,
          })),
        })
      }

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

      await createNotification({
        tx,
        issuerId: user.id,
        facilityId: values.facilityId,
        type: NotificationType.ACTIVITY_UPDATED,
        relatedId: activity.id,
      })

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

          await tx.activityStaff.deleteMany({
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

          await createNotification({
            tx,
            issuerId: user.id,
            facilityId,
            type: NotificationType.ACTIVITY_DELETED,
          })

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
        include: {
          staffMembers: {
            include: {
              user: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      })

      if (activities.length === 0) {
        return {
          success: false,
          message: "No se encontraron actividades para replicar",
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
            activities.map(async (sourceActivity) => {
              const {
                id: sourceId,
                facilityId: sourceFacilityId,
                staffMembers,
                ...activityData
              } = sourceActivity

              const replicatedActivity = await tx.activity.create({
                data: {
                  name: activityData.name,
                  description: activityData.description,
                  price: activityData.price,
                  isPublic: activityData.isPublic,
                  publicName: activityData.publicName,
                  generateInvoice: activityData.generateInvoice,
                  maxSessions: activityData.maxSessions,
                  mpAvailable: activityData.mpAvailable,
                  startDate: activityData.startDate,
                  endDate: activityData.endDate,
                  paymentType: activityData.paymentType,
                  activityType: activityData.activityType,
                  facilityId: targetFacilityId,
                },
              })

              if (staffMembers && staffMembers.length > 0) {
                const staffIds = staffMembers.map((staff) => staff.user.id)

                const targetFacilityStaff = await tx.userFacility.findMany({
                  where: {
                    facilityId: targetFacilityId,
                    userId: { in: staffIds },
                    user: {
                      role: "STAFF",
                    },
                  },
                  select: {
                    userId: true,
                  },
                })

                if (targetFacilityStaff.length > 0) {
                  await tx.activityStaff.createMany({
                    data: targetFacilityStaff.map((staff) => ({
                      activityId: replicatedActivity.id,
                      userId: staff.userId,
                    })),
                  })
                }
              }

              await createActivityTransaction({
                tx,
                type: "ACTIVITY_REPLICATED",
                activityId: sourceId,
                performedById: user.id,
                facilityId: sourceFacilityId,
                details: {
                  action: "Actividad replicada",
                  sourceId: sourceId,
                  sourceName: activityData.name,
                  sourceFacilityId: sourceFacilityId,
                  targetFacilityId: targetFacilityId,
                  replicatedId: replicatedActivity.id,
                  replicatedName: replicatedActivity.name,
                  targetFacilities: targetFacilities.map((facility) => ({
                    id: facility.id,
                    name: facility.name,
                    logoUrl: facility.logoUrl,
                  })),
                },
              })

              return {
                sourceActivity: {
                  id: sourceId,
                  name: activityData.name,
                },
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
          createNotification({
            tx,
            issuerId: user.id,
            facilityId,
            type: NotificationType.ACTIVITY_REPLICATED,
          }),
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
