import { type NextRequest, NextResponse } from "next/server"

import formatExercisesToString, { RoutineDataExport } from "@/types/routine"
import prisma from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<NextResponse<RoutineDataExport[] | { error: string }>> {
  try {
    const id = (await params).facilityId

    const allRoutines = await prisma.routine.findMany({
      where: {
        facilityId: id,
      },
      select: {
        id: true,
        name: true,
        description: true,
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
    })

    if (!allRoutines) {
      return NextResponse.json([])
    }

    const formattedRoutines: RoutineDataExport[] = allRoutines.map(
      (routine) => ({
        name: routine.name,
        description: routine.description || "-",
        exercises: formatExercisesToString(routine.exercises),
      }),
    )

    return NextResponse.json(formattedRoutines)
  } catch (error) {
    console.error("Error fetching routines:", error)
    return NextResponse.json({ error: "Failed to fetch routines" })
  }
}
