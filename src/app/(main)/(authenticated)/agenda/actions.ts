"use server"

import { revalidatePath } from "next/cache"
import { cache } from "react"
import { notFound } from "next/navigation"

import { type DiaryValues } from "@/lib/validation"
import prisma from "@/lib/prisma"

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

export async function createDiary(values: DiaryValues) {
  try {
    const sanitizedDaysAvailable = values.daysAvailable.map((day) => ({
      available: day.available,
      timeStart: day.timeStart,
      timeEnd: day.timeEnd,
    }))

    const sanitizedOfferDays = values.offerDays.map((offer) => ({
      isOffer: offer.isOffer,
      discountPercentage: offer.discountPercentage ?? 0,
    }))

    const diary = await prisma.diary.create({
      data: {
        facilityId: values.facilityId,
        activityId: values.activityId,
        name: values.name,
        typeSchedule: values.typeSchedule,
        dateFrom: values.dateFrom,
        dateUntil: values.dateUntil,
        repeatFor: values.repeatFor,
        daysAvailable: {
          createMany: {
            data: sanitizedDaysAvailable,
          },
        },
        offerDays: {
          createMany: {
            data: sanitizedOfferDays,
          },
        },
        termDuration: values.termDuration,
        amountOfPeople: values.amountOfPeople,
        isActive: values.isActive,
        genreExclusive: values.genreExclusive,
        worksHolidays: values.worksHolidays,
        observations: values.observations,
      },
    })

    console.log("Diary created:", diary)
    revalidatePath(`/agenda`)
    return { success: true, diary }
  } catch (error) {
    console.error("Error creating diary:", error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Error al crear la agenda" }
  }
}

export async function updateDiary(id: string, values: DiaryValues) {
  try {
    const diary = await prisma.diary.update({
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
      },
    })

    revalidatePath(`/agenda`)
    return { success: true, diary }
  } catch (error) {
    console.error(error)
    return { error: "Error al actualizar la agenda" }
  }
}

export async function deleteDiaries(diaryIds: string[]) {
  try {
    if (!diaryIds || diaryIds.length === 0) {
      return {
        success: false,
        message: "No se proporcionaron IDs de agendas para eliminar",
      }
    }

    await prisma.dayAvailable.deleteMany({
      where: {
        diaryId: { in: diaryIds },
      },
    })

    const { count } = await prisma.diary.deleteMany({
      where: {
        id: { in: diaryIds },
      },
    })

    if (count === 0) {
      return {
        success: false,
        message: "No se encontraron agendas para eliminar",
      }
    }

    return {
      success: true,
      message: `Se ${count === 1 ? "ha" : "han"} eliminado ${count} ${
        count === 1 ? "agenda" : "agendas"
      } correctamente`,
      deletedCount: count,
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error desconocido al eliminar las agendas",
    }
  }
}

export async function replicateDiaries(
  diaryIds: string[],
  targetFacilityIds: string[],
) {
  try {
    const diaries = await prisma.diary.findMany({
      where: { id: { in: diaryIds } },
      include: {
        daysAvailable: true,
      },
    })

    const replicatedDiaries = await Promise.all(
      targetFacilityIds.flatMap(async (facilityId) =>
        diaries.map(async (diary) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, facilityId: _, ...diaryData } = diary
          return prisma.diary.create({
            data: {
              ...diaryData,
              facilityId: facilityId,
              daysAvailable: {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                create: diary.daysAvailable.map(
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  ({ id, diaryId, ...dayData }) => dayData,
                ),
              },
            },
          })
        }),
      ),
    )

    const flattenedDiaries = replicatedDiaries.flat()

    revalidatePath(`/agenda`)
    return {
      success: true,
      message: `Se han replicado ${flattenedDiaries.length} agendas en ${targetFacilityIds.length} establecimientos.`,
      replicatedCount: flattenedDiaries.length,
    }
  } catch (error) {
    console.error("Error replicating diaries:", error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al replicar las agendas",
    }
  }
}
