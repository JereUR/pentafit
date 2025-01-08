"use server"

import { PrismaClient } from "@prisma/client"

import { validateRequest } from "@/auth"
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation"
import { getUserDataSelect } from "@/types/user"

const prisma = new PrismaClient()

export async function updateUserProfile(
  values: UpdateUserProfileValues & { avatarUrl?: string },
) {
  const validatedValues = updateUserProfileSchema.parse(values)

  const { user } = await validateRequest()

  if (!user) throw new Error("No autorizado.")

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      ...validatedValues,
      avatarUrl: values.avatarUrl,
    },
    select: getUserDataSelect(),
  })

  return updatedUser
}
