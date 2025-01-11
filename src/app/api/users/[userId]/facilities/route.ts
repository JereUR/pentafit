import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
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

    console.log({ facilities })

    if (!facilities || facilities.facilities.length === 0) {
      return NextResponse.json([])
    }

    const simplifiedFacilities = facilities.facilities.map((f) => f.facility)

    return NextResponse.json(simplifiedFacilities)
  } catch (error) {
    console.error("Error fetching facilities:", error)
    return NextResponse.json(
      { error: "Error al cargar los establecimientos" },
      { status: 500 },
    )
  }
}
