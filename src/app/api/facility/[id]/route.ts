import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { FacilityAllInfo } from "@/types/facility"
import { validateRequest } from "@/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = (await params).id

    const facility = await prisma.facility.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,
        isWorking: true,
        logoUrl: true,
        address: true,
        email: true,
        phone: true,
        facebook: true,
        instagram: true,
        users: {
          select: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
        metadata: {
          select: {
            title: true,
            logoWebUrl: true,
            primaryColor: true,
            secondaryColor: true,
            thirdColor: true,
            slogan: true,
          },
        },
      },
    })

    if (!facility) {
      return NextResponse.json(
        { error: "Establecimiento no encontrado" },
        { status: 404 },
      )
    }

    const transformedFacility: FacilityAllInfo = {
      name: facility.name,
      description: facility.description,
      email: facility.email,
      phone: facility.phone,
      address: facility.address,
      instagram: facility.instagram,
      facebook: facility.facebook,
      isActive: facility.isActive,
      isWorking: facility.isWorking,
      logoUrl: facility.logoUrl,
      metadata: facility.metadata,
      users: facility.users.map(({ user }) => ({
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
      })),
    }

    return NextResponse.json(transformedFacility)
  } catch (error) {
    console.error("Error fetching facility:", error)
    return NextResponse.json(
      { error: "Error al cargar el establecimiento" },
      { status: 500 },
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id
  const body = await request.json()
  try {
    const facilityState = await prisma.facility.findUnique({
      where: { id },
      select: { isWorking: true },
    })
    if (!facilityState) {
      return NextResponse.json(
        { error: "Establecimiento no encontrado o no activo" },
        { status: 404 },
      )
    }

    await prisma.facility.updateMany({
      where: { users: { some: { userId: body.userId } } },
      data: { isWorking: false },
    })
    const updatedFacility = await prisma.facility.update({
      where: { id },
      data: { isWorking: !facilityState.isWorking },
      select: {
        id: true,
        name: true,
        logoUrl: true,
        isWorking: true,
      },
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
