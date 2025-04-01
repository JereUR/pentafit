import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { UserFacilityData } from "@/types/facility"
import { validateRequest } from "@/auth"

export async function GET(): Promise<
  NextResponse<UserFacilityData[] | { error: string }>
> {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userFacilities = await prisma.userFacility.findMany({
      where: {
        userId: user.id,
      },
      include: {
        facility: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            metadata: {
              select: {
                primaryColor: true,
              },
            },
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
      primaryColor: facility.facility.metadata?.primaryColor || "#F97015",
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
