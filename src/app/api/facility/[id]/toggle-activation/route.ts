import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { validateRequest, validateRole } from "@/auth"
import { Role } from "@prisma/client"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const roleResult = await validateRole()

    if (!roleResult) {
      return NextResponse.json({ error: "Acceso denegado." }, { status: 401 })
    }
    const { role } = roleResult

    if (role !== Role.SUPER_ADMIN && role !== Role.ADMIN) {
      return NextResponse.json({ error: "Acceso denegado." }, { status: 401 })
    }

    const id = (await params).id
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
