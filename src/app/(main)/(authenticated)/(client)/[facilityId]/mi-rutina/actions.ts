"use server"

import { revalidatePath } from "next/cache"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import type { ExerciseCompletionResult } from "@/types/progress"
import { getDateForDayOfWeek } from "@/lib/utils"
import type { DayOfWeek } from "@prisma/client"
import { updateDailyRoutineProgress } from "../mi-progreso/actions"

export async function completeExercise({
  exerciseId,
  routineId,
  facilityId,
  completed,
  dayOfWeek,
  series,
  reps,
  weight,
  duration,
  notes,
}: {
  exerciseId: string
  routineId: string
  facilityId: string
  completed: boolean
  dayOfWeek: DayOfWeek
  series?: number
  reps?: number
  weight?: number
  duration?: number
  notes?: string
}): Promise<ExerciseCompletionResult> {
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

    const userRoutine = await prisma.userRoutine.findFirst({
      where: {
        userId: user.id,
        routineId,
        isActive: true,
      },
    })

    if (!userRoutine) {
      throw new Error("El usuario no tiene asignada esta rutina")
    }

    const targetDate = getDateForDayOfWeek(dayOfWeek)

    const nextDay = new Date(targetDate)
    nextDay.setDate(nextDay.getDate() + 1)

    const existingCompletion = await prisma.exerciseCompletion.findFirst({
      where: {
        userId: user.id,
        exerciseId,
        date: {
          gte: targetDate,
          lt: nextDay,
        },
      },
    })

    let exerciseCompletion

    if (existingCompletion) {
      exerciseCompletion = await prisma.exerciseCompletion.update({
        where: {
          id: existingCompletion.id,
        },
        data: {
          completed,
          series,
          reps,
          weight,
          duration,
          notes,
          updatedAt: new Date(),
        },
      })
    } else {
      exerciseCompletion = await prisma.exerciseCompletion.create({
        data: {
          userId: user.id,
          facilityId,
          exerciseId,
          routineId,
          date: targetDate,
          completed,
          series,
          reps,
          weight,
          duration,
          notes,
        },
      })
    }

    await updateDailyRoutineProgress(user.id, facilityId, routineId, targetDate)

    revalidatePath(`/${facilityId}/inicio`)
    revalidatePath(`/${facilityId}/mi-rutina`)
    revalidatePath(`/${facilityId}/mi-progreso`)

    return {
      success: true,
      data: exerciseCompletion,
      userId: user.id,
    }
  } catch (error) {
    console.error("Error completing exercise:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al registrar el ejercicio completado",
    }
  }
}

export async function completeAllExercises({
  exerciseIds,
  routineId,
  facilityId,
  dayOfWeek,
  completed,
}: {
  exerciseIds: string[]
  routineId: string
  facilityId: string
  dayOfWeek: DayOfWeek
  completed: boolean
}): Promise<ExerciseCompletionResult> {
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

    const userRoutine = await prisma.userRoutine.findFirst({
      where: {
        userId: user.id,
        routineId,
        isActive: true,
      },
    })

    if (!userRoutine) {
      throw new Error("El usuario no tiene asignada esta rutina")
    }

    const targetDate = getDateForDayOfWeek(dayOfWeek)

    const nextDay = new Date(targetDate)
    nextDay.setDate(nextDay.getDate() + 1)

    await prisma.$transaction(async (tx) => {
      for (const exerciseId of exerciseIds) {
        const existingCompletion = await tx.exerciseCompletion.findFirst({
          where: {
            userId: user.id,
            exerciseId,
            date: {
              gte: targetDate,
              lt: nextDay,
            },
          },
        })

        if (existingCompletion) {
          await tx.exerciseCompletion.update({
            where: {
              id: existingCompletion.id,
            },
            data: {
              completed,
              updatedAt: new Date(),
            },
          })
        } else {
          await tx.exerciseCompletion.create({
            data: {
              userId: user.id,
              facilityId,
              exerciseId,
              routineId,
              date: targetDate,
              completed,
            },
          })
        }
      }
    })

    await updateDailyRoutineProgress(user.id, facilityId, routineId, targetDate)

    revalidatePath(`/${facilityId}/inicio`)
    revalidatePath(`/${facilityId}/mi-rutina`)
    revalidatePath(`/${facilityId}/mi-progreso`)

    return {
      success: true,
      userId: user.id,
    }
  } catch (error) {
    console.error("Error completing all exercises:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al registrar los ejercicios completados",
    }
  }
}
