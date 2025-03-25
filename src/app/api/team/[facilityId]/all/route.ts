import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { validateRequest, validateRole } from "@/auth"
import { formatFacilities, TeamExportData } from "@/types/team"
import { Role } from "@prisma/client"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<NextResponse<TeamExportData[] | { error: string }>> {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 })
    }

    const roleResult = await validateRole()

    if (!roleResult) {
      return NextResponse.json({ error: "Acceso denegado." }, { status: 401 })
    }
    const { role } = roleResult

    if (role !== Role.SUPER_ADMIN && role !== Role.ADMIN) {
      return NextResponse.json({ error: "Acceso denegado." }, { status: 401 })
    }

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

    const allMembers: TeamExportData[] = allUsers.map(({ user }) => ({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email || "",
      gender: user.gender,
      role: user.role,
      birthday: new Date(user.birthday).toLocaleDateString(),
      facilities: formatFacilities(user.facilities),
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
