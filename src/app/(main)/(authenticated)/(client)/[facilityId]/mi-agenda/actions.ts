"use server"

import { validateRequest } from "@/auth"
import { revalidatePath } from "next/cache"
import type { DiaryPlanData, UserDiaryData } from "@/types/user"
import prisma from "@/lib/prisma"
import { DayOfWeek } from "@prisma/client"
import { getDateForDayOfWeek } from "@/lib/utils"
import { updateDailyClassAttendanceProgress } from "../mi-progreso/actions"

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
        const validDays = await tx.dayAvailable.findMany({
          where: {
            id: { in: selectedDayIds },
            diaryId: diaryId,
            available: true,
          },
          select: {
            id: true,
            dayOfWeek: true
          }
        })

        if (validDays.length !== selectedDayIds.length) {
          throw new Error("Algunos días seleccionados no son válidos")
        }

        const invalidPlanDays = validDays.some(
          day => !diaryPlan.daysOfWeek[day.dayOfWeek as number]
        )
        
        if (invalidPlanDays) {
          throw new Error("Algunos días seleccionados no están permitidos en tu plan")
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
        await tx.userDiaryAttachment.createMany({
          data: selectedDayIds.map(dayId => ({
            userDiaryId: userDiary.id,
            dayAvailableId: dayId
          }))
        })
      }

      revalidatePath(`/${facilityId}/mi-agenda`)
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
                    daysAvailable: {
                      orderBy: {
                        dayOfWeek: 'asc'
                      }
                    }, 
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
          orderBy: {
            dayAvailable: {
              dayOfWeek: 'asc'
            }
          }
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

      const selectedDays = userDiary.attachments.map((attachment) => ({
        id: attachment.dayAvailableId,
        timeStart: attachment.dayAvailable.timeStart,
        timeEnd: attachment.dayAvailable.timeEnd,
        dayOfWeek: attachment.dayAvailable.dayOfWeek as number
      }))

      const filteredDaysAvailable = diary.daysAvailable
        .filter(day => day.available)
        .map(day => ({
          id: day.id,
          available: day.available,
          timeStart: day.timeStart,
          timeEnd: day.timeEnd,
          dayOfWeek: day.dayOfWeek as number
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
        selectedDays: selectedDays.filter(day => day.dayOfWeek !== null),
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
            dayOfWeek: day.dayOfWeek 
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

export async function recordDiaryAttendance({
  diaryId,
  userDiaryId,
  facilityId,
  attended,
  dayOfWeek,
  dayAvailableId
}: {
  diaryId: string
  userDiaryId: string
  facilityId: string
  attended: boolean
  dayOfWeek: DayOfWeek
  dayAvailableId: string
}) {
  try {
    const { user } = await validateRequest()

    if (!user) {
      throw new Error("No autorizado.")
    }

    const userFacility = await prisma.userFacility.findUnique({
      where: {
        userId_facilityId: {
          userId: user.id,
          facilityId,
        },
      },
    })

    if (!userFacility) {
      throw new Error("El usuario no pertenece a este establecimiento")
    }

    const userDiary = await prisma.userDiary.findFirst({
      where: {
        id: userDiaryId,
        userId: user.id,
        isActive: true,
      },
      include: {
        attachments: {
          where: { dayAvailableId }
        }
      }
    })

    if (!userDiary) {
      throw new Error("El usuario no tiene esta suscripción activa")
    }

    const dayAvailable = await prisma.dayAvailable.findUnique({
      where: {
        id: dayAvailableId,
        diaryId
      }
    })

    if (!dayAvailable) {
      throw new Error("El día no pertenece a esta agenda")
    }

    const targetDate = getDateForDayOfWeek(dayOfWeek)
    const nextDay = new Date(targetDate)
    nextDay.setDate(nextDay.getDate() + 1)

    const existingAttendance = await prisma.diaryAttendance.findFirst({
      where: {
        userId: user.id,
        diaryId,
        dayAvailableId,
        date: {
          gte: targetDate,
          lt: nextDay,
        },
      },
    })

    if (existingAttendance) {
      await prisma.diaryAttendance.update({
        where: {
          id: existingAttendance.id,
        },
        data: {
          attended,
          updatedAt: new Date(),
        },
      })
    } else {
      await prisma.diaryAttendance.create({
        data: {
          userId: user.id,
          facilityId,
          diaryId,
          userDiaryId,
          dayAvailableId,
          date: targetDate,
          attended,
        },
      })
    }

    await updateDailyClassAttendanceProgress(user.id, facilityId, userDiaryId, targetDate)

    revalidatePath(`/${facilityId}/mi-agenda`)
    revalidatePath(`/${facilityId}/mi-progreso`)

    return {
      success: true,
      userId: user.id,
    }
  } catch (error) {
    console.error("Error recording diary attendance:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al registrar la asistencia",
    }
  }
}

export async function getTodayDiaryAttendances(facilityId: string) {
  try {
    const { user } = await validateRequest()

    if (!user) {
      throw new Error("No autorizado.")
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return await prisma.diaryAttendance.findMany({
      where: {
        userId: user.id,
        facilityId,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
      select: {
        id: true,
        diaryId: true,
        attended: true,
      },
    })
  } catch (error) {
    console.error("Error fetching today's diary attendances:", error)
    throw error
  }
}