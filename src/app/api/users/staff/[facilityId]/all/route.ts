import { type NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { Role } from "@prisma/client"
import { StaffMember } from "@/types/activity"
import { validateRequest } from "@/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<NextResponse<StaffMember[] | { error: string }>> {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 })
    }

    const id = (await params).facilityId

    const allUsers = await prisma.userFacility.findMany({
      where: {
        facilityId: id,
      },
      include: {
        user: {
          select: {
            id: true,
            lastName: true,
            firstName: true,
            email: true,
            avatarUrl: true,
            role: true,
          },
        },
      },
    })

    const filterStaff = allUsers.filter((user) => user.user.role === Role.STAFF)

    if (!filterStaff) {
      return NextResponse.json([])
    }

    const formattedStaff: StaffMember[] = filterStaff.map((client) => ({
      id: client.user.id,
      firstName: client.user.firstName,
      lastName: client.user.lastName,
      email: client.user.email || "",
      avatarUrl: client.user.avatarUrl || null,
    }))

    return NextResponse.json(formattedStaff)
  } catch (error) {
    console.error("Error fetching staff:", error)
    return NextResponse.json({ error: "Failed to fetch staff" })
  }
}
