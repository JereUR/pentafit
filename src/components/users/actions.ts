"use server"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation"
import { getUserDataSelect } from "@/types/user"

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
