import { type NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { UserClient } from "@/types/user"
import { Role } from "@prisma/client"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<NextResponse<UserClient[] | { error: string }>> {
  try {
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

    const filterClients = allUsers.filter(
      (user) => user.user.role === Role.CLIENT,
    )

    if (!filterClients) {
      return NextResponse.json([])
    }

    const formattedClients: UserClient[] = filterClients.map((client) => ({
      id: client.user.id,
      firstName: client.user.firstName,
      lastName: client.user.lastName,
      email: client.user.email || "",
      avatarUrl: client.user.avatarUrl || null,
    }))

    return NextResponse.json(formattedClients)
  } catch (error) {
    console.error("Error fetching Clients:", error)
    return NextResponse.json({ error: "Failed to fetch Clients" })
  }
}
