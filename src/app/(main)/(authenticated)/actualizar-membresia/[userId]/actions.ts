"use server"

import { PrismaClient, Role } from "@prisma/client"

import { validateRequest } from "@/auth"
import {
  membershipUpdateSchema,
  MembershipUpdateValues,
} from "@/lib/validation"

const prisma = new PrismaClient()

export async function updateMembership(values: MembershipUpdateValues) {
  const validatedValues = membershipUpdateSchema.parse(values)

  const { user } = await validateRequest()

  if (!user) throw new Error("No autorizado.")

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      membershipLevel: validatedValues.membershipLevel,
      role: Role.SUPER_ADMIN,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      membershipLevel: true,
    },
  })

  return updatedUser
}
