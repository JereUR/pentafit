import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"
import type { UserClient } from "@/types/user"
import type { Allergy, ChronicCondition, Injury, Medication } from "@/types/health"
import { safeJsonParse } from "@/lib/utils"

export async function GET(request: Request, { params }: { params: Promise<{ nutritionalPlanId: string }> }) {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const nutritionalPlanId = (await params).nutritionalPlanId

    const userPlans = await prisma.userNutritionalPlan.findMany({
      where: {
        nutritionalPlanId,
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
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

    const assignedUsers: UserClient[] = userPlans.map((up) => ({
      id: up.user.id,
      firstName: up.user.firstName,
      lastName: up.user.lastName,
      email: up.user.email || "",
      avatarUrl: up.user.avatarUrl,
      hasChronicConditions: up.user.healthInfo?.hasChronicConditions || false,
      chronicConditions: safeJsonParse<ChronicCondition>(up.user.healthInfo?.chronicConditions, []),
      takingMedication: up.user.healthInfo?.takingMedication || false,
      medications: safeJsonParse<Medication>(up.user.healthInfo?.medications, []),
      hasInjuries: up.user.healthInfo?.hasInjuries || false,
      injuries: safeJsonParse<Injury>(up.user.healthInfo?.injuries, []),
      hasAllergies: up.user.healthInfo?.hasAllergies || false,
      allergies: safeJsonParse<Allergy>(up.user.healthInfo?.allergies, []),
    }))

    return NextResponse.json(assignedUsers)
  } catch (error) {
    console.error("Error fetching assigned users:", error)
    return NextResponse.json({ error: "Error al obtener usuarios asignados" }, { status: 500 })
  }
}
