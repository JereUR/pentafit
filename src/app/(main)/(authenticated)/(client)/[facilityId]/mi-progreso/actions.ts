"use server"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function completeExercise({
  exerciseId,
  routineId,
  facilityId,
  completed,
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
  series?: number
  reps?: number
  weight?: number
  duration?: number
  notes?: string
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

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existingCompletion = await prisma.exerciseCompletion.findFirst({
      where: {
        userId: user.id,
        exerciseId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
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
          completed,
          series,
          reps,
          weight,
          duration,
          notes,
        },
      })
    }

    await updateRoutineProgress(user.id, facilityId, routineId)

    revalidatePath(`/${facilityId}/inicio`)
    revalidatePath(`/${facilityId}/mi-rutina`)

    return { success: true, data: exerciseCompletion }
  } catch (error) {
    console.error("Error completing exercise:", error)
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error al registrar el ejercicio completado",
    )
  }
}

async function updateRoutineProgress(
  userId: string,
  facilityId: string,
  routineId: string,
) {
  try {
    const dailyExercises = await prisma.dailyExercise.findMany({
      where: {
        routineId,
      },
      include: {
        exercises: true,
      },
    })

    const totalExercises = dailyExercises.reduce(
      (acc, day) => acc + day.exercises.length,
      0,
    )

    const completedExercises = await prisma.exerciseCompletion.count({
      where: {
        userId,
        routineId,
        completed: true,
        date: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      },
    })

    const routineProgress =
      totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existingProgress = await prisma.userProgress.findUnique({
      where: {
        userId_facilityId_type_date: {
          userId,
          facilityId,
          type: "EXERCISE_COMPLETION",
          date: today,
        },
      },
    })

    if (existingProgress) {
      await prisma.userProgress.update({
        where: {
          id: existingProgress.id,
        },
        data: {
          value: routineProgress,
          updatedAt: new Date(),
        },
      })
    } else {
      await prisma.userProgress.create({
        data: {
          userId,
          facilityId,
          type: "EXERCISE_COMPLETION",
          date: today,
          value: routineProgress,
          routineId,
        },
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating routine progress:", error)
    throw new Error("Error al actualizar el progreso de la rutina")
  }
}

export async function recordMeasurement({
  facilityId,
  weight,
  height,
  bodyFat,
  muscle,
  chest,
  waist,
  hips,
  arms,
  thighs,
  notes,
}: {
  facilityId: string
  weight?: number
  height?: number
  bodyFat?: number
  muscle?: number
  chest?: number
  waist?: number
  hips?: number
  arms?: number
  thighs?: number
  notes?: string
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

    const measurement = await prisma.userMeasurement.create({
      data: {
        userId: user.id,
        facilityId,
        weight,
        height,
        bodyFat,
        muscle,
        chest,
        waist,
        hips,
        arms,
        thighs,
        notes,
      },
    })

    revalidatePath(`/${facilityId}/inicio`)
    revalidatePath(`/${facilityId}/mi-progreso`)

    return { success: true, data: measurement }
  } catch (error) {
    console.error("Error recording measurement:", error)
    throw new Error(
      error instanceof Error ? error.message : "Error al registrar las medidas",
    )
  }
}

export async function getUserProgress(facilityId: string) {
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

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const routineProgress = await prisma.userProgress.findFirst({
      where: {
        userId: user.id,
        facilityId,
        type: "EXERCISE_COMPLETION",
      },
      orderBy: {
        date: "desc",
      },
    })

    const nutritionProgress = await prisma.userProgress.findFirst({
      where: {
        userId: user.id,
        facilityId,
        type: "NUTRITION_ADHERENCE",
      },
      orderBy: {
        date: "desc",
      },
    })

    const classProgress = await prisma.userProgress.findFirst({
      where: {
        userId: user.id,
        facilityId,
        type: "CLASS_ATTENDANCE",
      },
      orderBy: {
        date: "desc",
      },
    })

    const routineValue = routineProgress?.value || 0
    const nutritionValue = nutritionProgress?.value || 0
    const classValue = classProgress?.value || 0

    const progressTypesCount = [
      routineValue,
      nutritionValue,
      classValue,
    ].filter((value) => value > 0).length

    const overallProgress =
      progressTypesCount > 0
        ? Math.round(
            (routineValue + nutritionValue + classValue) / progressTypesCount,
          )
        : 0

    const latestMeasurement = await prisma.userMeasurement.findFirst({
      where: {
        userId: user.id,
        facilityId,
      },
      orderBy: {
        date: "desc",
      },
    })

    const historicalProgress = await prisma.userProgress.findMany({
      where: {
        userId: user.id,
        facilityId,
        date: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        date: "asc",
      },
    })

    interface ProgressDataPoint {
      date: Date
      value: number
    }

    const progressByType: Record<string, ProgressDataPoint[]> = {}

    historicalProgress.forEach((progress) => {
      if (!progressByType[progress.type]) {
        progressByType[progress.type] = []
      }

      progressByType[progress.type].push({
        date: progress.date,
        value: progress.value,
      })
    })

    return {
      routine: routineValue,
      nutrition: nutritionValue,
      classes: classValue,
      overall: overallProgress,
      lastUpdated: new Date().toISOString(),
      measurements: latestMeasurement,
      historical: progressByType,
    }
  } catch (error) {
    console.error("Error fetching user progress:", error)
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error al obtener el progreso del usuario",
    )
  }
}
