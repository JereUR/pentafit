import { type NextRequest, NextResponse } from "next/server"
import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { facilityId: string } },
) {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = user.id
    const facilityId = params.facilityId

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
              include: {
                exercises: true,
              },
            },
          },
        },
      },
    })

    if (!userRoutine) {
      return NextResponse.json({
        success: true,
        data: null,
      })
    }

    const data = {
      id: userRoutine.routineId,
      name: userRoutine.routine.name,
      description: userRoutine.routine.description,
      dailyExercises: userRoutine.routine.dailyExercises.map(
        (dailyExercise) => ({
          dayOfWeek: dailyExercise.dayOfWeek,
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
        }),
      ),
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error fetching user routine:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener la rutina",
      },
      { status: 500 },
    )
  }
}
