import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { FacilityReduceData } from "@/types/facility"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
): Promise<NextResponse<FacilityReduceData[] | { error: string }>> {
  try {
    const id = (await params).userId

    const facilities = await prisma.user.findUnique({
      where: { id },
      select: {
        facilities: {
          select: {
            facility: {
              select: {
                id: true,
                name: true,
                description: true,
                isActive: true,
                isWorking: true,
                logoUrl: true,
              },
            },
          },
        },
      },
    })

    if (!facilities || facilities.facilities.length === 0) {
      return NextResponse.json([])
    }

    const simplifiedFacilities: FacilityReduceData[] =
      facilities.facilities.map((f) => ({
        id: f.facility.id,
        name: f.facility.name,
        description: f.facility.description,
        isActive: f.facility.isActive,
        isWorking: f.facility.isWorking,
        logoUrl: f.facility.logoUrl,
      }))

    return NextResponse.json(simplifiedFacilities)
  } catch (error) {
    console.error("Error fetching facilities:", error)
    return NextResponse.json(
      { error: "Error al cargar los establecimientos" },
      { status: 500 },
    )
  }
}
