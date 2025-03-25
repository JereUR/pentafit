import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { validateRequest, validateRole } from "@/auth"
import { TeamData } from "@/types/team"
import { Role } from "@prisma/client"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<
  NextResponse<{ members: TeamData[]; total: number } | { error: string }>
> {
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
    const { searchParams } = request.nextUrl
    const page = parseInt(searchParams.get("page") || "1", 10)
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10)
    const search = searchParams.get("search") || ""
    const skip = (page - 1) * pageSize

    const [usersData, total] = await Promise.all([
      prisma.userFacility.findMany({
        where: {
          facilityId: id,
          user: {
            OR: [
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
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
        skip,
        take: pageSize,
      }),
      prisma.userFacility.count({
        where: {
          facilityId: id,
          user: {
            OR: [
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      }),
    ])

    const members: TeamData[] = usersData.map(({ user }) => ({
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

    return NextResponse.json({ members, total })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Error al cargar las actividades" },
      { status: 500 },
    )
  }
}
