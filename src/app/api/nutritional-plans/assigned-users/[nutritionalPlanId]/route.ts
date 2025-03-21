import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"
import type { UserClient } from "@/types/user"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ nutritionalPlanId: string }> },
) {
  try {
    const { user } = await validateRequest()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const nutritionalPlanId = (await params).nutritionalPlanId

    const userPlans = await prisma.userNutritionalPlan.findMany({
      where: {
        nutritionalPlanId,
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

    const assignedUsers: UserClient[] = userPlans.map((up) => ({
      id: up.user.id,
      firstName: up.user.firstName,
      lastName: up.user.lastName,
      email: up.user.email || "",
      avatarUrl: up.user.avatarUrl,
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
