import { type NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import type { UserClientWithPlan } from "@/types/user"
import { Role } from "@prisma/client"
import { validateRequest } from "@/auth"
import { safeJsonParse } from "@/lib/utils"
import type { Allergy, ChronicCondition, Injury, Medication } from "@/types/health"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<NextResponse<UserClientWithPlan[] | { error: string }>> {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 })
    }

    const facilityId = (await params).facilityId

    const userFacilities = await prisma.userFacility.findMany({
      where: {
        facilityId,
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
            plan: {
              include: {
                plan: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    const filterClients = userFacilities.filter((uf) => uf.user.role === Role.CLIENT && uf.user.plan.length > 0)

    if (!filterClients.length) {
      return NextResponse.json([])
    }

    const formattedClients: UserClientWithPlan[] = filterClients.map((client) => ({
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
      plan: {
            id: client.user.plan[0].plan.id,
            name: client.user.plan[0].plan.name,
            price: client.user.plan[0].plan.price,
          },
    }))

    return NextResponse.json(formattedClients)
  } catch (error) {
    console.error("Error fetching clients with plans:", error)
    return NextResponse.json({ error: "Failed to fetch clients with plans" }, { status: 500 })
  }
}