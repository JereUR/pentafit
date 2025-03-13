import { type NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import type { RoutineData } from "@/types/routine"
import formatExercisesToString from "@/types/routine"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<
  NextResponse<{ allPresetRoutines: RoutineData[] } | { error: string }>
> {
  try {
    const id = (await params).facilityId

    const routines = await prisma.presetRoutine.findMany({
      where: {
        facilityId: id,
      },
      include: {
        dailyExercises: {
          include: {
            exercises: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const formattedRoutines: RoutineData[] = routines.map((routine) => ({
      id: routine.id,
      name: routine.name,
      description: routine.description,
      facilityId: id,
      dailyExercises: routine.dailyExercises.map((dailyExercise) => ({
        id: dailyExercise.id,
        dayOfWeek: dailyExercise.dayOfWeek,
        routineId: dailyExercise.routineId,
        exercises: dailyExercise.exercises.map((exercise) => ({
          id: exercise.id,
          name: exercise.name,
          bodyZone: exercise.bodyZone,
          series: exercise.series,
          count: exercise.count,
          measure: exercise.measure,
          rest: exercise.rest || null,
          description: exercise.description || null,
          photoUrl: exercise.photoUrl || null,
          dailyExerciseId: exercise.dailyExerciseId,
        })),
        createdAt: dailyExercise.createdAt,
        updatedAt: dailyExercise.updatedAt,
      })),
      exercises: formatExercisesToString(routine.dailyExercises),
      createdAt: routine.createdAt,
      updatedAt: routine.updatedAt,
    }))

    return NextResponse.json({ allPresetRoutines: formattedRoutines })
  } catch (error) {
    console.error("Error fetching routines:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}
