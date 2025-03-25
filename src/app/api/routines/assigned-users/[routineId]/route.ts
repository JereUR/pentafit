import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"
import { UserClient } from "@/types/user"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ routineId: string }> },
) {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const routineId = (await params).routineId

    const userRoutines = await prisma.userRoutine.findMany({
      where: {
        routineId,
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
    })

    const assignedUsers: UserClient[] = userRoutines.map((ur) => ({
      id: ur.user.id,
      firstName: ur.user.firstName,
      lastName: ur.user.lastName,
      email: ur.user.email || "",
      avatarUrl: ur.user.avatarUrl,
    }))

    return NextResponse.json(assignedUsers)
  } catch (error) {
    console.error("Error fetching assigned users:", error)
    return NextResponse.json(
      { error: "Error al obtener usuarios asignados" },
      { status: 500 },
    )
  }
}
