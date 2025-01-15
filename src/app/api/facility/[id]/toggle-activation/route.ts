import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id

  try {
    const facilityState = await prisma.facility.findUnique({
      where: { id },
    })

    if (!facilityState) {
      return NextResponse.json(
        { error: "Establecimiento no encontrado" },
        { status: 404 },
      )
    }

    const updatedFacility = await prisma.facility.update({
      where: { id },
      data: { isActive: !facilityState.isActive, isWorking: false },
    })

    return NextResponse.json(updatedFacility)
  } catch (error) {
    console.error("Error updating facility:", error)
    return NextResponse.json(
      { error: "Error al actualizar el establecimiento" },
      { status: 500 },
    )
  }
}
