import { type NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { RoutineData } from "@/types/routine"

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
          exercises: {
            select: {
              id: true,
              name: true,
              description: true,
              bodyZone: true,
              series: true,
              rest: true,
              count: true,
              measure: true,
              photoUrl: true,
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
      isActive: routine.isActive,
      exercises: routine.exercises.map((exercise) => ({
        ...exercise,
        rest: exercise.rest || null,
        description: exercise.description || null,
        photoUrl: exercise.photoUrl || null,
      })),
      facilityId: id,
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
