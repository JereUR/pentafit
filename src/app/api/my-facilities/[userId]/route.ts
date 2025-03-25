import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { UserFacilityData } from "@/types/facility"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
): Promise<NextResponse<UserFacilityData[] | { error: string }>> {
  try {
    const userId = (await params).userId
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userFacilities = await prisma.userFacility.findMany({
      where: {
        userId,
      },
      include: {
        facility: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
          },
        },
      },
    })

    if (!userFacilities) {
      return NextResponse.json([])
    }

    const formattedUserFacilities = userFacilities.map((facility) => ({
      id: facility.facility.id,
      name: facility.facility.name,
      logoUrl: facility.facility.logoUrl,
    }))

    return NextResponse.json(formattedUserFacilities)
  } catch (error) {
    console.error("Error fetching user facilities:", error)
    return NextResponse.json(
      { error: "Error al cargar establecimientos del usuario" },
      { status: 500 },
    )
  }
}
