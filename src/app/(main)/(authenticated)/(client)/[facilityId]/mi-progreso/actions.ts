"use server"

import { revalidatePath } from "next/cache"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { MeasurementFormValues } from "@/lib/validation"
import {MeasurementResult, ProgressData, ProgressDataPoint} from "@/types/progress"
import { DayOfWeek } from "@prisma/client"
import { calculateAverage } from "@/lib/utils"
import { calculateGlobalAttendanceProgress } from "../mi-agenda/actions"

export async function recordMeasurement(
  values: MeasurementFormValues & { facilityId: string },
): Promise<MeasurementResult> {
  try {
    const { user } = await validateRequest()

    if (!user) {
      throw new Error("No autorizado.")
    }

    const userFacility = await prisma.userFacility.findUnique({
      where: {
        userId_facilityId: {
          userId: user.id,
          facilityId: values.facilityId,
        },
      },
    })

    if (!userFacility) {
      throw new Error("El usuario no pertenece a este establecimiento")
    }

    const measurement = await prisma.userMeasurement.create({
      data: {
        userId: user.id,
        facilityId: values.facilityId,
        weight: values.weight,
        height: values.height,
        bodyFat: values.bodyFat,
        muscle: values.muscle,
        chest: values.chest,
        waist: values.waist,
        hips: values.hips,
        arms: values.arms,
        thighs: values.thighs,
        notes: values.notes,
      },
    })

    revalidatePath(`/${values.facilityId}/inicio`)
    revalidatePath(`/${values.facilityId}/mi-progreso`)

    return {
      success: true,
      data: measurement,
      userId: user.id,
    }
  } catch (error) {
    console.error("Error recording measurement:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al registrar las medidas",
    }
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

export async function calculateDailyRoutineProgress(
  userId: string,
  facilityId: string,
  routineId: string,
  date: Date,
): Promise<number> {
  const dailyExercises = await prisma.dailyExercise.findMany({
    where: {
      routineId,
    },
    include: {
      exercises: true,
    },
  })

  const dayOfWeek = getDayOfWeekEnum(date)

  const todaysExercises = dailyExercises.filter((de) => de.dayOfWeek === dayOfWeek).flatMap((de) => de.exercises)

  if (todaysExercises.length === 0) {
    return 0 
  }

  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const completedExercises = await prisma.exerciseCompletion.count({
    where: {
      userId,
      routineId,
      completed: true,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
      exerciseId: {
        in: todaysExercises.map((e) => e.id),
      },
    },
  })

  return todaysExercises.length > 0 ? (completedExercises / todaysExercises.length) * 100 : 0
}

export async function calculateDailyNutritionProgress(
  userId: string,
  facilityId: string,
  nutritionalPlanId: string,
  date: Date,
): Promise<number> {
  const dayOfWeek = getDayOfWeekEnum(date)

  const dailyMeal = await prisma.dailyMeal.findFirst({
    where: {
      nutritionalPlanId,
      dayOfWeek,
    },
    include: {
      meals: {
        include: {
          foodItems: true,
        },
      },
    },
  })

  if (!dailyMeal || dailyMeal.meals.length === 0) {
    return 0 
  }

  const allFoodItems = dailyMeal.meals.flatMap((meal) => meal.foodItems)

  if (allFoodItems.length === 0) {
    return 0
  }

  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const completedFoodItems = await prisma.foodItemCompletion.count({
    where: {
      userId,
      nutritionalPlanId,
      completed: true,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
      foodItemId: {
        in: allFoodItems.map((item) => item.id),
      },
    },
  })

  return allFoodItems.length > 0 ? (completedFoodItems / allFoodItems.length) * 100 : 0
}

export async function updateDailyRoutineProgress(
  userId: string,
  facilityId: string,
  routineId: string,
  date = new Date(),
): Promise<void> {
  const progressValue = await calculateDailyRoutineProgress(userId, facilityId, routineId, date)

  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)

  const existingProgress = await prisma.userProgress.findUnique({
    where: {
      userId_facilityId_type_date: {
        userId,
        facilityId,
        type: "EXERCISE_COMPLETION",
        date: startOfDay,
      },
    },
  })

  if (existingProgress) {
    await prisma.userProgress.update({
      where: {
        id: existingProgress.id,
      },
      data: {
        value: progressValue,
        routineId,
        updatedAt: new Date(),
      },
    })
  } else {
    await prisma.userProgress.create({
      data: {
        userId,
        facilityId,
        type: "EXERCISE_COMPLETION",
        date: startOfDay,
        value: progressValue,
        routineId,
      },
    })
  }
}

export async function updateDailyNutritionProgress(
  userId: string,
  facilityId: string,
  nutritionalPlanId: string,
  date = new Date(),
): Promise<void> {
  const progressValue = await calculateDailyNutritionProgress(userId, facilityId, nutritionalPlanId, date)

  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)

  const existingProgress = await prisma.userProgress.findUnique({
    where: {
      userId_facilityId_type_date: {
        userId,
        facilityId,
        type: "NUTRITION_ADHERENCE",
        date: startOfDay,
      },
    },
  })

  if (existingProgress) {
    await prisma.userProgress.update({
      where: {
        id: existingProgress.id,
      },
      data: {
        value: progressValue,
        nutritionalPlanId,
        updatedAt: new Date(),
      },
    })
  } else {
    await prisma.userProgress.create({
      data: {
        userId,
        facilityId,
        type: "NUTRITION_ADHERENCE",
        date: startOfDay,
        value: progressValue,
        nutritionalPlanId,
      },
    })
  }
}

export async function getUserProgressData(userId: string, facilityId: string): Promise<ProgressData> {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  thirtyDaysAgo.setHours(0, 0, 0, 0)

  const progressRecords = await prisma.userProgress.findMany({
    where: {
      userId,
      facilityId,
      date: {
        gte: thirtyDaysAgo,
      },
    },
    orderBy: {
      date: "asc",
    },
  })

  const progressByType: Record<string, ProgressDataPoint[]> = {}

  progressRecords.forEach((progress) => {
    if (!progressByType[progress.type]) {
      progressByType[progress.type] = []
    }

    progressByType[progress.type].push({
      date: progress.date,
      value: progress.value,
    })
  })

  const routineAvg = calculateAverage(progressByType["EXERCISE_COMPLETION"] || [])
  const nutritionAvg = calculateAverage(progressByType["NUTRITION_ADHERENCE"] || [])
  const classesAvg = calculateAverage(progressByType["CLASS_ATTENDANCE"] || [])

  const progressTypes = [routineAvg, nutritionAvg, classesAvg].filter((v) => v > 0)
  const overallProgress =
    progressTypes.length > 0 ? progressTypes.reduce((sum, val) => sum + val, 0) / progressTypes.length : 0

  const latestMeasurement = await prisma.userMeasurement.findFirst({
    where: {
      userId,
      facilityId,
    },
    orderBy: {
      date: "desc",
    },
  })

  return {
    routine: routineAvg,
    nutrition: nutritionAvg,
    classes: classesAvg,
    overall: overallProgress,
    lastUpdated: new Date().toISOString(),
    measurements: latestMeasurement || null,
    historical: progressByType,
  }
}

function getDayOfWeekEnum(date: Date): DayOfWeek {
  const dayIndex = date.getDay()
  const days: DayOfWeek[] = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ] as DayOfWeek[]

  return days[dayIndex]
}

export async function calculateDailyClassAttendanceProgress(
  userId: string,
  facilityId: string,
  userDiaryId: string,
  date: Date,
): Promise<number> {
  const userDiary = await prisma.userDiary.findUnique({
    where: { id: userDiaryId },
    include: {
      attachments: {
        include: {
          dayAvailable: true
        }
      },
      diaryPlan: true
    }
  })

  if (!userDiary) {
    return 0
  }

  const startOfWeek = new Date(date)
  startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() || 7) + 1)
  startOfWeek.setHours(0, 0, 0, 0)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(endOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)

  const attendances = await prisma.diaryAttendance.findMany({
    where: {
      userId,
      userDiaryId,
      date: {
        gte: startOfWeek,
        lte: endOfWeek
      },
      attended: true
    },
    select: {
      dayAvailableId: true
    }
  })

  const selectedDaysCount = userDiary.attachments.length
  
  const uniqueAttendedDays = new Set(
    attendances.map(a => a.dayAvailableId)
  ).size

  const progress = selectedDaysCount > 0 
    ? (uniqueAttendedDays / selectedDaysCount) * 100 
    : 0

  return Math.min(progress, 100)
}

export async function updateDailyClassAttendanceProgress(
  userId: string,
  facilityId: string,
  userDiaryId: string,
  date: Date = new Date()
): Promise<void> {
  const globalProgress = await calculateGlobalAttendanceProgress(userId, facilityId, date)

  const userDiary = await prisma.userDiary.findUnique({
    where: { id: userDiaryId },
    include: {
      diaryPlan: { 
        include: { 
          activity: { 
            include: { 
              diaries: true 
            } 
          } 
        }
      }
    }
  })
  const diaryId = userDiary?.diaryPlan.activity.diaries[0]?.id

  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)

  await prisma.userProgress.upsert({
    where: {
      userId_facilityId_type_date: {
        userId,
        facilityId,
        type: "CLASS_ATTENDANCE",
        date: startOfDay,
      },
    },
    update: { 
      value: globalProgress,
      diaryId, 
    },
    create: {
      userId,
      facilityId,
      type: "CLASS_ATTENDANCE",
      date: startOfDay,
      value: globalProgress,
      diaryId, 
    },
  })
}