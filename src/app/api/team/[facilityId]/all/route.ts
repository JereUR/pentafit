import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { validateRole } from "@/auth"
import { TeamData } from "@/types/team"
import { Role } from "@prisma/client"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<NextResponse<TeamData[] | { error: string }>> {
  const roleResult = await validateRole()

  if (!roleResult) {
    return NextResponse.json({ error: "Acceso denegado." }, { status: 401 })
  }
  const { role } = roleResult

  if (role !== Role.SUPER_ADMIN && role !== Role.ADMIN) {
    return NextResponse.json({ error: "Acceso denegado." }, { status: 401 })
  }

  try {
    const id = (await params).facilityId

    const allUsers = await prisma.userFacility.findMany({
      where: {
        facilityId: id,
      },
      select: {
        facilityId: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            birthday: true,
            gender: true,
            role: true,
            avatarUrl: true,
            facilities: {
              select: {
                facility: {
                  select: {
                    id: true,
                    name: true,
                    logoUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!allUsers) {
      return NextResponse.json([])
    }

    const allMembers: TeamData[] = allUsers.map(({ user }) => ({
      ...user,
      facilityId: id,
      email: user.email || "",
      birthday: new Date(user.birthday),
      avatarUrl: user.avatarUrl || "",
      facilities: user.facilities.map((f) => ({
        id: f.facility.id,
        name: f.facility.name,
        logoUrl: f.facility.logoUrl || "",
      })),
    }))

    return NextResponse.json(allMembers)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Error al cargar las actividades" },
      { status: 500 },
    )
  }
}
