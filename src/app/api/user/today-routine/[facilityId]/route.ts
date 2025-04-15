import { type NextRequest, NextResponse } from "next/server"
import { getCurrentDayOfWeek } from "@/lib/utils"
import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
) {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = user.id
    const facilityId = (await params).facilityId
    const today = getCurrentDayOfWeek()

    const userFacility = await prisma.userFacility.findUnique({
      where: {
        userId_facilityId: {
          userId,
          facilityId,
        },
      },
    })

    if (!userFacility) {
      return NextResponse.json(
        { error: "User does not belong to this facility" },
        { status: 403 },
      )
    }

    const userRoutine = await prisma.userRoutine.findFirst({
      where: {
        userId,
        isActive: true,
        routine: {
          facilityId,
        },
      },
      include: {
        routine: {
          include: {
            dailyExercises: {
              where: {
                dayOfWeek: today,
              },
              include: {
                exercises: true,
              },
            },
          },
        },
      },
    })

    if (!userRoutine || !userRoutine.routine.dailyExercises.length) {
      return NextResponse.json({
        success: true,
        data: null,
      })
    }

    const dailyExercise = userRoutine.routine.dailyExercises[0]

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const tomorrowStart = new Date(todayStart)
    tomorrowStart.setDate(tomorrowStart.getDate() + 1)

    const completedExercises = await prisma.exerciseCompletion.findMany({
      where: {
        userId,
        routineId: userRoutine.routineId,
        completed: true,
        date: {
          gte: todayStart,
          lt: tomorrowStart,
        },
      },
      select: {
        exerciseId: true,
      },
    })

    const completedExerciseIds = completedExercises.map(
      (item) => item.exerciseId,
    )

    const data = {
      id: userRoutine.routineId,
      name: userRoutine.routine.name,
      description: userRoutine.routine.description,
      exercises: dailyExercise.exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        bodyZone: exercise.bodyZone,
        series: exercise.series,
        count: exercise.count,
        measure: exercise.measure,
        rest: exercise.rest,
        description: exercise.description,
        photoUrl: exercise.photoUrl,
      })),
      completedExercises: completedExerciseIds,
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error fetching today's routine:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener la rutina de hoy",
      },
      { status: 500 },
    )
  }
}
