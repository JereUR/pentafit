import { type NextRequest, NextResponse } from "next/server"

import formatExercisesToString, {
  type RoutineDataExport,
} from "@/types/routine"
import prisma from "@/lib/prisma"
import formatUsersAssignedToString from "@/types/user"
import { validateRequest } from "@/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<NextResponse<RoutineDataExport[] | { error: string }>> {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 })
    }

    const id = (await params).facilityId

    const allRoutines = await prisma.routine.findMany({
      where: {
        facilityId: id,
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
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    })

    if (!allRoutines) {
      return NextResponse.json([])
    }

    const formattedRoutines = allRoutines.map((routine) => {
      const userAssignedString = formatUsersAssignedToString(
        routine.userRoutines.map((userRoutine) => ({
          firstName: userRoutine.user.firstName,
          lastName: userRoutine.user.lastName,
          email: userRoutine.user.email,
        })),
      )

      return {
        name: routine.name,
        description: routine.description || "-",
        exercises: formatExercisesToString(routine.dailyExercises),
        assignedUsersCount: userAssignedString,
      }
    })

    return NextResponse.json(formattedRoutines)
  } catch (error) {
    console.error("Error fetching routines:", error)
    return NextResponse.json({ error: "Failed to fetch routines" })
  }
}
