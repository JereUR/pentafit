/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { revalidatePath } from "next/cache"
import { cache } from "react"
import { notFound } from "next/navigation"

import type { DiaryValues } from "@/lib/validation"
import prisma from "@/lib/prisma"
import type { DiaryData, Schedule } from "@/types/diary"
import { validateRequest } from "@/auth"
import { createNotification } from "@/lib/notificationHelpers"
import { NotificationType, Prisma, TransactionType } from "@prisma/client"
import type { DeleteEntityResult } from "@/lib/utils"
import { createDiaryTransaction } from "@/lib/transactionHelpers"

type DiaryResult = {
  success: boolean
  diary?: DiaryData
  error?: string
}

export const getDiaryById = cache(
  async (id: string): Promise<DiaryValues & { id: string }> => {
    try {
      const diary = await prisma.diary.findUnique({
        where: { id },
        include: {
          facility: true,
          activity: true,
          daysAvailable: true,
          offerDays: true,
        },
      })

      if (!diary) {
        notFound()
      }

      return {
        id: diary.id,
        facilityId: diary.facilityId,
        activityId: diary.activityId,
        name: diary.name,
        typeSchedule: diary.typeSchedule,
        dateFrom: diary.dateFrom,
        dateUntil: diary.dateUntil,
        repeatFor: diary.repeatFor,
        offerDays: diary.offerDays.map((day) => ({
          isOffer: day.isOffer,
          discountPercentage: day.discountPercentage,
        })),
        termDuration: diary.termDuration,
        amountOfPeople: diary.amountOfPeople,
        isActive: diary.isActive,
        genreExclusive: diary.genreExclusive,
        worksHolidays: diary.worksHolidays,
        observations: diary.observations,
        daysAvailable: diary.daysAvailable.map((day) => ({
          available: day.available,
          timeStart: day.timeStart,
          timeEnd: day.timeEnd,
        })),
      }
    } catch (error) {
      console.error("Error fetching diary:", error)
      throw new Error("Failed to fetch diary")
    }
  },
)

export async function createDiary(values: DiaryValues): Promise<DiaryResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      const sanitizedDaysAvailable =
        values.daysAvailable?.map((day: Schedule) => ({
          available: day.available,
          timeStart: day.timeStart,
          timeEnd: day.timeEnd,
        })) ?? []

      const sanitizedOfferDays =
        values.offerDays?.map(
          (offer: { isOffer: boolean; discountPercentage: number | null }) => ({
            isOffer: offer.isOffer,
            discountPercentage: offer.discountPercentage,
          }),
        ) ?? []

      const diaryData = {
        facilityId: values.facilityId,
        activityId: values.activityId,
        name: values.name,
        typeSchedule: values.typeSchedule,
        dateFrom: values.dateFrom,
        dateUntil: values.dateUntil,
        repeatFor: values.repeatFor,
        termDuration: values.termDuration,
        amountOfPeople: values.amountOfPeople,
        isActive: values.isActive,
        genreExclusive: values.genreExclusive,
        worksHolidays: values.worksHolidays,
        observations: values.observations,
        daysAvailable:
          sanitizedDaysAvailable.length > 0
            ? {
                createMany: { data: sanitizedDaysAvailable },
              }
            : undefined,
        offerDays:
          sanitizedOfferDays.length > 0
            ? {
                createMany: { data: sanitizedOfferDays },
              }
            : undefined,
      }

      if (!diaryData) {
        throw new Error("Payload for diary creation is null or undefined.")
      }

      const diary = await tx.diary.create({
        data: diaryData,
        include: {
          daysAvailable: true,
          offerDays: true,
        },
      })

      await createDiaryTransaction({
        tx,
        type: TransactionType.DIARY_CREATED,
        diaryId: diary.id,
        performedById: user.id,
        facilityId: diary.facilityId,
        details: {
          action: "Agenda creada",
          attachmentId: diary.id,
          attachmentName: diary.name,
        },
      })

      await createNotification(
        tx,
        user.id,
        values.facilityId,
        NotificationType.DIARY_CREATED,
        diary.id,
      )

      revalidatePath(`/agenda`)
      return { success: true, diary }
    } catch (error) {
      console.error(error)
      return { success: false, error: "Error al crear la agenda" }
    }
  })
}

export async function updateDiary(
  id: string,
  values: DiaryValues,
): Promise<DiaryResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma
    .$transaction(async (tx) => {
      const diary = await tx.diary.update({
        where: { id },
        data: {
          facilityId: values.facilityId,
          activityId: values.activityId,
          name: values.name,
          typeSchedule: values.typeSchedule,
          dateFrom: values.dateFrom,
          dateUntil: values.dateUntil,
          repeatFor: values.repeatFor,
          offerDays: {
            deleteMany: {},
            create: values.offerDays.map((day) => ({
              isOffer: day.isOffer,
              discountPercentage: day.discountPercentage,
            })),
          },
          termDuration: values.termDuration,
          amountOfPeople: values.amountOfPeople,
          isActive: values.isActive,
          genreExclusive: values.genreExclusive,
          worksHolidays: values.worksHolidays,
          observations: values.observations,
          daysAvailable: {
            deleteMany: {},
            create: values.daysAvailable.map((day) => ({
              available: day.available,
              timeStart: day.timeStart,
              timeEnd: day.timeEnd,
            })),
          },
        },
        include: {
          facility: true,
          activity: true,
          daysAvailable: true,
          offerDays: true,
        },
      })

      await createDiaryTransaction({
        tx,
        type: TransactionType.DIARY_UPDATED,
        diaryId: diary.id,
        performedById: user.id,
        facilityId: diary.facilityId,
        details: {
          action: "Agenda actualizada",
          attachmentId: diary.id,
          attachmentName: diary.name,
        },
      })

      await createNotification(
        tx,
        user.id,
        values.facilityId,
        NotificationType.DIARY_UPDATED,
        diary.id,
      )

      revalidatePath(`/agenda`)
      return { success: true, diary }
    })
    .catch((error) => {
      console.error(error)
      return { success: false, error: "Error al editar la agenda" }
    })
}

export async function deleteDiaries(
  diaryIds: string[],
  facilityId: string,
): Promise<DeleteEntityResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma
    .$transaction(
      async (tx) => {
        try {
          if (!diaryIds || diaryIds.length === 0) {
            return {
              success: false,
              message: "No se proporcionaron IDs de agendas para eliminar",
            }
          }

          const diaries = await tx.diary.findMany({
            where: {
              id: { in: diaryIds },
            },
            select: {
              id: true,
              name: true,
              activity: {
                select: {
                  name: true,
                },
              },
            },
          })

          if (diaries.length === 0) {
            return {
              success: false,
              message: "No se encontraron agendas para eliminar",
            }
          }

          for (const diary of diaries) {
            await createDiaryTransaction({
              tx,
              type: TransactionType.DIARY_DELETED,
              diaryId: diary.id,
              performedById: user.id,
              facilityId,
              details: {
                action: "Agenda borrada",
                attachmentId: diary.id,
                attachmentName: diary.name,
              },
            })
          }

          await tx.dayAvailable.deleteMany({
            where: {
              diaryId: { in: diaryIds },
            },
          })

          await tx.offerDay.deleteMany({
            where: {
              diaryId: { in: diaryIds },
            },
          })

          const { count } = await tx.diary.deleteMany({
            where: {
              id: { in: diaryIds },
            },
          })

          await createNotification(
            tx,
            user.id,
            facilityId,
            NotificationType.DIARY_DELETED,
          )

          revalidatePath("/agenda")

          return {
            success: true,
            message: `Se ${count === 1 ? "ha" : "han"} eliminado ${count} ${
              count === 1 ? "agenda" : "agendas"
            } correctamente`,
            deletedCount: count,
          }
        } catch (error) {
          console.error("Error deleting diaries:", error)
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
            : "Error al eliminar las agendas",
      }
    })
}

export async function replicateDiaries(
  diaryIds: string[],
  targetFacilityIds: string[],
) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma
    .$transaction(async (tx) => {
      const diaries = await tx.diary.findMany({
        where: { id: { in: diaryIds } },
        include: {
          daysAvailable: true,
          offerDays: true,
          activity: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      if (diaries.length === 0) {
        return {
          success: false,
          message: "No se encontraron agendas para replicar",
        }
      }

      const replicationResults = await Promise.all(
        targetFacilityIds.flatMap(async (targetFacilityId) =>
          Promise.all(
            diaries.map(async (sourceDiary) => {
              const {
                id: sourceId,
                facilityId: sourceFacilityId,
                activity,
                daysAvailable,
                offerDays,
                ...diaryData
              } = sourceDiary

              const replicatedDiary = await tx.diary.create({
                data: {
                  ...diaryData,
                  facilityId: targetFacilityId,
                  activityId: activity.id,
                  daysAvailable: {
                    create: daysAvailable.map(
                      ({ id, diaryId, ...dayData }) => dayData,
                    ),
                  },
                  offerDays: {
                    create: offerDays.map(
                      ({ id, diaryId, ...dayData }) => dayData,
                    ),
                  },
                },
                include: {
                  activity: {
                    select: {
                      name: true,
                    },
                  },
                },
              })

              await createDiaryTransaction({
                tx,
                type: TransactionType.DIARY_REPLICATED,
                diaryId: sourceId,
                performedById: user.id,
                facilityId: sourceFacilityId,
                details: {
                  action: "Agenda replicada",
                  sourceDiaryId: sourceId,
                  sourceDiaryName: sourceDiary.name,
                  sourceFacilityId: sourceFacilityId,
                  targetFacilityId: targetFacilityId,
                  replicatedDiaryId: replicatedDiary.id,
                  replicatedDiaryName: replicatedDiary.name,
                  activityName: activity.name,
                  daysAvailableCount: daysAvailable.length,
                  offerDaysCount: offerDays.length,
                },
              })

              return {
                sourceDiary,
                replicatedDiary,
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
            NotificationType.DIARY_REPLICATED,
          ),
        ),
      )

      revalidatePath(`/agenda`)
      return {
        success: true,
        message: `Se han replicado ${flattenedResults.length} agendas en ${targetFacilityIds.length} establecimientos.`,
        replicatedCount: flattenedResults.length,
        details: {
          replicatedDiaries: flattenedResults.map((result) => ({
            attachmentId: result.sourceDiary.id,
            attachmentName: result.sourceDiary.name,
            replicatedId: result.replicatedDiary.id,
            targetFacilityId: result.targetFacilityId,
          })),
        },
      }
    })
    .catch((error) => {
      console.error("Error replicating diaries:", error)
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al replicar las agendas",
      }
    })
}
