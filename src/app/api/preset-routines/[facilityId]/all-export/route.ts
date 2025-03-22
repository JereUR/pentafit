import { type NextRequest, NextResponse } from "next/server"

import formatExercisesToString, {
  PresetRoutineDataExport,
} from "@/types/routine"
import prisma from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<NextResponse<PresetRoutineDataExport[] | { error: string }>> {
  try {
    const id = (await params).facilityId

    const allRoutines = await prisma.presetRoutine.findMany({
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
    })

    if (!allRoutines) {
      return NextResponse.json([])
    }

    const formattedRoutines: PresetRoutineDataExport[] = allRoutines.map(
      (routine) => ({
        name: routine.name,
        description: routine.description || "-",
        exercises: formatExercisesToString(routine.dailyExercises),
      }),
    )

    return NextResponse.json(formattedRoutines)
  } catch (error) {
    console.error("Error fetching routines:", error)
    return NextResponse.json({ error: "Failed to fetch routines" })
  }
}
