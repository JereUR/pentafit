"use server"

import { validateRequest } from "@/auth"
import { revalidatePath } from "next/cache"
import type { DiaryPlanData, UserDiaryData } from "@/types/user"
import prisma from "@/lib/prisma"

export async function subscribeToDiary({
  diaryId,
  facilityId,
}: {
  diaryId: string
  facilityId: string
}) {
  try {
    const { user } = await validateRequest()

    if (!user) {
      throw new Error("No autorizado.")
    }

    const diary = await prisma.diary.findFirst({
      where: {
        id: diaryId,
        facilityId: facilityId,
        isActive: true,
      },
    })

    if (!diary) {
      throw new Error("Agenda no encontrada o inactiva")
    }

    const existingUserDiary = await prisma.userDiary.findUnique({
      where: {
        userId_diaryId: {
          userId: user.id,
          diaryId: diaryId,
        },
      },
    })

    if (existingUserDiary) {
      if (!existingUserDiary.isActive) {
        const updatedUserDiary = await prisma.userDiary.update({
          where: {
            id: existingUserDiary.id,
          },
          data: {
            isActive: true,
            endDate: null,
          },
        })

        revalidatePath(`/${facilityId}/diary-plans`)
        return { success: true, userDiary: updatedUserDiary }
      }

      throw new Error("Ya estás suscrito a esta agenda")
    }

    const userDiary = await prisma.userDiary.create({
      data: {
        userId: user.id,
        diaryId: diaryId,
        isActive: true,
        startDate: new Date(),
      },
    })

    revalidatePath(`/${facilityId}/diary-plans`)
    return { success: true, userDiary }
  } catch (error) {
    console.error("Error subscribing to diary:", error)
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error al suscribirse a la agenda",
    )
  }
}

export async function unsubscribeFromDiary({
  userDiaryId,
  facilityId,
}: {
  userDiaryId: string
  facilityId: string
}) {
  try {
    const { user } = await validateRequest()

    if (!user) {
      throw new Error("No autorizado.")
    }

    const userDiary = await prisma.userDiary.findFirst({
      where: {
        id: userDiaryId,
        userId: user.id,
        diary: {
          facilityId: facilityId,
        },
      },
    })

    if (!userDiary) {
      throw new Error("Suscripción no encontrada")
    }

    const updatedUserDiary = await prisma.userDiary.update({
      where: {
        id: userDiaryId,
      },
      data: {
        isActive: false,
        endDate: new Date(),
      },
    })

    revalidatePath(`/${facilityId}/diary-plans`)
    return { success: true, userDiary: updatedUserDiary }
  } catch (error) {
    console.error("Error unsubscribing from diary:", error)
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error al cancelar la suscripción",
    )
  }
}

export async function getUserDiaries(
  facilityId: string,
): Promise<{ userDiaries: UserDiaryData[] }> {
  try {
    const { user } = await validateRequest()

    if (!user) {
      throw new Error("No autorizado.")
    }
    const userDiaries = await prisma.userDiary.findMany({
      where: {
        userId: user.id,
        isActive: true,
        diary: {
          facilityId: facilityId,
        },
      },
      include: {
        diary: {
          include: {
            daysAvailable: true,
            activity: {
              select: {
                id: true,
                name: true,
                description: true,
                activityType: true,
              },
            },
          },
        },
      },
    })

    if (!userDiaries || userDiaries.length === 0) {
      return { userDiaries: [] }
    }

    const formattedUserDiaries: UserDiaryData[] = userDiaries.map(
      (userDiary) => ({
        id: userDiary.id,
        userId: userDiary.userId,
        diaryId: userDiary.diaryId,
        isActive: userDiary.isActive,
        startDate: userDiary.startDate,
        endDate: userDiary.endDate,
        diary: {
          id: userDiary.diary.id,
          name: userDiary.diary.name,
          typeSchedule: userDiary.diary.typeSchedule,
          dateFrom: userDiary.diary.dateFrom,
          dateUntil: userDiary.diary.dateUntil,
          termDuration: userDiary.diary.termDuration,
          amountOfPeople: userDiary.diary.amountOfPeople,
          isActive: userDiary.diary.isActive,
          genreExclusive: userDiary.diary.genreExclusive,
          worksHolidays: userDiary.diary.worksHolidays,
          observations: userDiary.diary.observations,
          activity: userDiary.diary.activity,
          daysAvailable: userDiary.diary.daysAvailable.map((day) => ({
            id: day.id,
            available: day.available,
            timeStart: day.timeStart,
            timeEnd: day.timeEnd,
          })),
        },
      }),
    )

    return { userDiaries: formattedUserDiaries }
  } catch (error) {
    console.error("Error fetching user diaries:", error)
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error al cargar tus actividades",
    )
  }
}

export async function getDiaryPlans(
  facilityId: string,
): Promise<{ diaryPlans: DiaryPlanData[] }> {
  try {
    const { user } = await validateRequest()

    if (!user) {
      throw new Error("No autorizado.")
    }

    const userPlan = await prisma.userPlan.findFirst({
      where: {
        userId: user.id,
        isActive: true,
        plan: {
          facilityId: facilityId,
        },
      },
      include: {
        plan: true,
      },
    })

    if (!userPlan) {
      return { diaryPlans: [] }
    }

    const diaryPlans = await prisma.diaryPlan.findMany({
      where: {
        planId: userPlan.planId,
      },
      include: {
        activity: {
          select: {
            id: true,
            name: true,
            description: true,
            activityType: true,
            diaries: {
              where: {
                isActive: true,
                dateUntil: {
                  gte: new Date(),
                },
              },
              include: {
                daysAvailable: true,
              },
            },
          },
        },
      },
    })

    if (!diaryPlans || diaryPlans.length === 0) {
      return { diaryPlans: [] }
    }

    const formattedDiaryPlans: DiaryPlanData[] = diaryPlans.map(
      (diaryPlan) => ({
        id: diaryPlan.id,
        name: diaryPlan.name,
        daysOfWeek: diaryPlan.daysOfWeek,
        sessionsPerWeek: diaryPlan.sessionsPerWeek,
        planId: diaryPlan.planId,
        activityId: diaryPlan.activityId,
        activity: {
          id: diaryPlan.activity.id,
          name: diaryPlan.activity.name,
          description: diaryPlan.activity.description,
          activityType: diaryPlan.activity.activityType,
        },
        diaries: diaryPlan.activity.diaries.map((diary) => ({
          id: diary.id,
          name: diary.name,
          typeSchedule: diary.typeSchedule,
          dateFrom: diary.dateFrom,
          dateUntil: diary.dateUntil,
          termDuration: diary.termDuration,
          amountOfPeople: diary.amountOfPeople,
          isActive: diary.isActive,
          genreExclusive: diary.genreExclusive,
          worksHolidays: diary.worksHolidays,
          observations: diary.observations,
          daysAvailable: diary.daysAvailable.map((day) => ({
            id: day.id,
            available: day.available,
            timeStart: day.timeStart,
            timeEnd: day.timeEnd,
          })),
        })),
      }),
    )

    return { diaryPlans: formattedDiaryPlans }
  } catch (error) {
    console.error("Error fetching diary plans:", error)
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error al cargar los planes de agenda",
    )
  }
}
