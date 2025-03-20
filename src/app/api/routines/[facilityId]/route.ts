import prisma from "@/lib/prisma"
import formatExercisesToString, { RoutineData } from "@/types/routine"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<
  NextResponse<{ routines: RoutineData[]; total: number } | { error: string }>
> {
  try {
    const id = (await params).facilityId
    const { searchParams } = request.nextUrl
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10", 10)
    const search = searchParams.get("search") || ""
    const skip = (page - 1) * pageSize

    const [routines, total] = await Promise.all([
      prisma.routine.findMany({
        where: {
          facilityId: id,
          OR: [{ name: { contains: search, mode: "insensitive" } }],
        },
        include: {
          dailyExercises: {
            include: {
              exercises: true,
            },
          },
          userRoutines: {
            where: {
              isActive: true,
            },
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.routine.count({
        where: {
          facilityId: id,
          OR: [{ name: { contains: search, mode: "insensitive" } }],
        },
      }),
    ])

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
      assignedUsers: routine.userRoutines.map((ur) => ur.user),
      assignedUsersCount: routine.userRoutines.length,
      createdAt: routine.createdAt,
      updatedAt: routine.updatedAt,
    }))

    return NextResponse.json({ routines: formattedRoutines, total })
  } catch (error) {
    console.error("Error fetching routines:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}
