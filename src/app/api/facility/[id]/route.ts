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

    if (!facilities || facilities.facilities.length === 0) {
      return NextResponse.json(
        { error: "Sin establecimientos disponibles" },
        { status: 404 },
      )
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { facilityId: string } },
) {
  const { facilityId } = params
  const body = await request.json()

  try {
    await prisma.facility.updateMany({
      where: { users: { some: { userId: body.userId } } },
      data: { isWorking: false },
    })

    const updatedFacility = await prisma.facility.update({
      where: { id: facilityId },
      data: { isWorking: true },
    })

    return NextResponse.json(updatedFacility)
  } catch (error) {
    console.error("Error updating facility:", error)
    return NextResponse.json(
      { error: "Error al actualizar la instalación" },
      { status: 500 },
    )
  }
}