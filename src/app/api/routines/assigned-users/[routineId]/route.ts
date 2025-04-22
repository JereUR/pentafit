import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"
import type { UserClient } from "@/types/user"
import type { Allergy, ChronicCondition, Injury, Medication } from "@/types/health"
import { safeJsonParse } from "@/lib/utils"

export async function GET(request: Request, { params }: { params: Promise<{ routineId: string }> }) {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const routineId = (await params).routineId

    const userRoutines = await prisma.userRoutine.findMany({
      where: {
        routineId,
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

    const assignedUsers: UserClient[] = userRoutines.map((ur) => ({
      id: ur.user.id,
      firstName: ur.user.firstName,
      lastName: ur.user.lastName,
      email: ur.user.email || "",
      avatarUrl: ur.user.avatarUrl,
      hasChronicConditions: ur.user.healthInfo?.hasChronicConditions || false,
      chronicConditions: safeJsonParse<ChronicCondition>(ur.user.healthInfo?.chronicConditions, []),
      takingMedication: ur.user.healthInfo?.takingMedication || false,
      medications: safeJsonParse<Medication>(ur.user.healthInfo?.medications, []),
      hasInjuries: ur.user.healthInfo?.hasInjuries || false,
      injuries: safeJsonParse<Injury>(ur.user.healthInfo?.injuries, []),
      hasAllergies: ur.user.healthInfo?.hasAllergies || false,
      allergies: safeJsonParse<Allergy>(ur.user.healthInfo?.allergies, []),
    }))

    return NextResponse.json(assignedUsers)
  } catch (error) {
    console.error("Error fetching assigned users:", error)
    return NextResponse.json({ error: "Error al obtener usuarios asignados" }, { status: 500 })
  }
}
