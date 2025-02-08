import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"

export async function GET() {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const workingFacility = await prisma.facility.findFirst({
      where: {
        isWorking: true,
        users: {
          some: {
            userId: user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        logoUrl: true,
        isActive: true,
      },
    })

    if (!workingFacility) {
      return NextResponse.json(null)
    }

    return NextResponse.json(workingFacility)
  } catch (error) {
    console.error("Error fetching working facility:", error)
    return NextResponse.json(
      { error: "Failed to fetch working facility" },
      { status: 500 },
    )
  }
}
