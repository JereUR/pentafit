"use server"

import { validateRequest } from "@/auth"
import { revalidatePath } from "next/cache"
import type { DiaryPlanData, UserDiaryData } from "@/types/user"
import prisma from "@/lib/prisma"

export async function subscribeToDiary({
  diaryId,
  facilityId,
  selectedDayIds,
}: {
  diaryId: string
  facilityId: string
  selectedDayIds?: string[]
}) {
  try {
    const { user } = await validateRequest()

    if (!user) {
      throw new Error("No autorizado.")
    }

    return await prisma.$transaction(async (tx) => {
      const diary = await tx.diary.findFirst({
        where: {
          id: diaryId,
          facilityId: facilityId,
          isActive: true,
        },
        include: {
          daysAvailable: true,
        },
      })

      if (!diary) {
        throw new Error("Agenda no encontrada o inactiva")
      }

      const diaryPlan = await tx.diaryPlan.findFirst({
        where: {
          activity: {
            diaries: {
              some: {
                id: diaryId,
              },
            },
          },
        },
      })

      if (!diaryPlan) {
        throw new Error("Plan de agenda no encontrado")
      }

      if (diaryPlan.vacancies <= 0) {
        throw new Error("No hay cupos disponibles para esta actividad")
      }

      if (selectedDayIds && selectedDayIds.length > 0) {
        const validDayIds = diary.daysAvailable
          .filter((day) => day.available)
          .map((day) => day.id)

        const allDaysValid = selectedDayIds.every((dayId) =>
          validDayIds.includes(dayId),
        )

        if (!allDaysValid) {
          throw new Error("Algunos días seleccionados no son válidos")
        }

        if (selectedDayIds.length > diaryPlan.sessionsPerWeek) {
          throw new Error(
            `Solo puedes seleccionar ${diaryPlan.sessionsPerWeek} días por semana`,
          )
        }
      }

      const existingUserDiary = await tx.userDiary.findFirst({
        where: {
          userId: user.id,
          diaryPlanId: diaryPlan.id,
          isActive: true,
        },
      })

      if (existingUserDiary) {
        throw new Error("Ya estás suscrito a esta actividad")
      }

      const inactiveUserDiary = await tx.userDiary.findFirst({
        where: {
          userId: user.id,
          diaryPlanId: diaryPlan.id,
          isActive: false,
        },
      })

      let userDiary

      if (inactiveUserDiary) {
        userDiary = await tx.userDiary.update({
          where: {
            id: inactiveUserDiary.id,
          },
          data: {
            isActive: true,
            endDate: null,
          },
        })

        await tx.userDiaryAttachment.deleteMany({
          where: {
            userDiaryId: userDiary.id,
          },
        })
      } else {
        userDiary = await tx.userDiary.create({
          data: {
            userId: user.id,
            diaryPlanId: diaryPlan.id,
            isActive: true,
            startDate: new Date(),
          },
        })
      }

      await tx.diaryPlan.update({
        where: {
          id: diaryPlan.id,
        },
        data: {
          vacancies: {
            decrement: 1,
          },
        },
      })

      if (selectedDayIds && selectedDayIds.length > 0) {
        await Promise.all(
          selectedDayIds.map((dayId) =>
            tx.userDiaryAttachment.create({
              data: {
                userDiaryId: userDiary.id,
                dayAvailableId: dayId,
              },
            }),
          ),
        )
      }

      return { success: true, userDiary }
    })
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

    return await prisma.$transaction(async (tx) => {
      const userDiary = await tx.userDiary.findFirst({
        where: {
          id: userDiaryId,
          userId: user.id,
          isActive: true,
          diaryPlan: {
            plan: { facilityId: facilityId },
          },
        },
        include: {
          diaryPlan: true,
        },
      })

      if (!userDiary) {
        throw new Error("Suscripción no encontrada o ya inactiva")
      }

      const updatedUserDiary = await tx.userDiary.update({
        where: {
          id: userDiaryId,
        },
        data: {
          isActive: false,
          endDate: new Date(),
        },
      })

      await tx.diaryPlan.update({
        where: {
          id: userDiary.diaryPlanId,
        },
        data: {
          vacancies: {
            increment: 1,
          },
        },
      })

      await tx.userDiaryAttachment.deleteMany({
        where: {
          userDiaryId: userDiaryId,
        },
      })

      revalidatePath(`/${facilityId}/mi-agenda`)
      return { success: true, userDiary: updatedUserDiary }
    })
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
        diaryPlan: {
          plan: {
            facilityId: facilityId,
          },
        },
      },
      include: {
        diaryPlan: {
          include: {
            activity: {
              select: {
                id: true,
                name: true,
                description: true,
                activityType: true,
                diaries: {
                  where: {
                    facilityId: facilityId,
                    isActive: true,
                  },
                  include: {
                    daysAvailable: true,
                  },
                },
              },
            },
          },
        },
        attachments: {
          include: {
            dayAvailable: true,
          },
        },
      },
    })

    if (!userDiaries || userDiaries.length === 0) {
      return { userDiaries: [] }
    }

    const formattedUserDiaries: UserDiaryData[] = []

    for (const userDiary of userDiaries) {
      const diary = userDiary.diaryPlan.activity.diaries[0]

      if (!diary) {
        continue
      }

      const subscribedDayIds = userDiary.attachments.map(
        (attachment) => attachment.dayAvailableId,
      )

      const filteredDaysAvailable = diary.daysAvailable
        .filter(
          (day) =>
            subscribedDayIds.length === 0 || subscribedDayIds.includes(day.id),
        )
        .map((day) => ({
          id: day.id,
          available: day.available,
          timeStart: day.timeStart,
          timeEnd: day.timeEnd,
        }))

      formattedUserDiaries.push({
        id: userDiary.id,
        userId: userDiary.userId,
        diaryId: diary.id,
        isActive: userDiary.isActive,
        startDate: userDiary.startDate,
        endDate: userDiary.endDate,
        diary: {
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
          activity: {
            id: userDiary.diaryPlan.activity.id,
            name: userDiary.diaryPlan.activity.name,
            description: userDiary.diaryPlan.activity.description,
            activityType: userDiary.diaryPlan.activity.activityType,
          },
          daysAvailable: filteredDaysAvailable,
        },
        selectedDays: userDiary.attachments.map((attachment) => ({
          id: attachment.dayAvailableId,
          timeStart: attachment.dayAvailable.timeStart,
          timeEnd: attachment.dayAvailable.timeEnd,
        })),
        diaryPlan: {
          id: userDiary.diaryPlan.id,
          name: userDiary.diaryPlan.name,
          sessionsPerWeek: userDiary.diaryPlan.sessionsPerWeek,
          daysOfWeek: userDiary.diaryPlan.daysOfWeek,
        },
      })
    }

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
        vacancies: diaryPlan.vacancies,
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
