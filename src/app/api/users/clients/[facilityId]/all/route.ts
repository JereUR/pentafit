import { type NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import type { UserClient } from "@/types/user"
import { Role } from "@prisma/client"
import { validateRequest } from "@/auth"
import type { Allergy, ChronicCondition, Injury, Medication } from "@/types/health"
import { safeJsonParse } from "@/lib/utils"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<NextResponse<UserClient[] | { error: string }>> {
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
            healthInfo: {
              select: {
                hasChronicConditions: true,
                chronicConditions: true,
                takingMedication: true,
                medications: true,
                hasInjuries: true,
                injuries: true,
                hasAllergies: true,
                allergies: true,
              },
            },
          },
        },
      },
    })

    const filterClients = allUsers.filter((user) => user.user.role === Role.CLIENT)

    if (!filterClients) {
      return NextResponse.json([])
    }

    const formattedClients: UserClient[] = filterClients.map((client) => ({
      id: client.user.id,
      firstName: client.user.firstName,
      lastName: client.user.lastName,
      email: client.user.email || "",
      avatarUrl: client.user.avatarUrl || null,
      hasChronicConditions: client.user.healthInfo?.hasChronicConditions || false,
      chronicConditions: safeJsonParse<ChronicCondition>(client.user.healthInfo?.chronicConditions, []),
      takingMedication: client.user.healthInfo?.takingMedication || false,
      medications: safeJsonParse<Medication>(client.user.healthInfo?.medications, []),
      hasInjuries: client.user.healthInfo?.hasInjuries || false,
      injuries: safeJsonParse<Injury>(client.user.healthInfo?.injuries, []),
      hasAllergies: client.user.healthInfo?.hasAllergies || false,
      allergies: safeJsonParse<Allergy>(client.user.healthInfo?.allergies, []),
    }))

    return NextResponse.json(formattedClients)
  } catch (error) {
    console.error("Error fetching Clients:", error)
    return NextResponse.json({ error: "Failed to fetch Clients" })
  }
}
