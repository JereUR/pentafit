import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ planId: string }> },
) {
  try {
    const { user } = await validateRequest()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const planId = (await params).planId

    const userPlans = await prisma.userPlan.findMany({
      where: {
        planId,
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

    const users = userPlans.map((up) => up.user)

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching plan assigned users:", error)
    return NextResponse.json(
      { error: "Error al obtener los usuarios asignados al plan" },
      { status: 500 },
    )
  }
}
