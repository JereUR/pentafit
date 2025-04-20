"use server"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import {
  healthInfoSchema,
  HealthInfoValues,
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

export async function updateUserHealthInfo(values: HealthInfoValues) {
  const { user } = await validateRequest()

  if (!user) throw new Error("No autorizado.")

  const validatedValues = healthInfoSchema.parse(values)

  const updatedHealthInfo = await prisma.userHealthInfo.upsert({
    where: {
      userId: validatedValues.userId,
    },
    create: {
      userId: validatedValues.userId,
      facilityId: validatedValues.facilityId,
      hasChronicConditions: validatedValues.hasChronicConditions,
      chronicConditions: validatedValues.hasChronicConditions
        ? validatedValues.chronicConditions
        : [],
      takingMedication: validatedValues.takingMedication,
      medications: validatedValues.takingMedication
        ? validatedValues.medications
        : [],
      hasInjuries: validatedValues.hasInjuries,
      injuries: validatedValues.hasInjuries ? validatedValues.injuries : [],
      hasAllergies: validatedValues.hasAllergies,
      allergies: validatedValues.hasAllergies ? validatedValues.allergies : [],
      emergencyContactName: validatedValues.emergencyContactName,
      emergencyContactPhone: validatedValues.emergencyContactPhone,
      emergencyContactRelation: validatedValues.emergencyContactRelation,
      medicalNotes: validatedValues.medicalNotes,
    },
    update: {
      hasChronicConditions: validatedValues.hasChronicConditions,
      chronicConditions: validatedValues.hasChronicConditions
        ? validatedValues.chronicConditions
        : [],
      takingMedication: validatedValues.takingMedication,
      medications: validatedValues.takingMedication
        ? validatedValues.medications
        : [],
      hasInjuries: validatedValues.hasInjuries,
      injuries: validatedValues.hasInjuries ? validatedValues.injuries : [],
      hasAllergies: validatedValues.hasAllergies,
      allergies: validatedValues.hasAllergies ? validatedValues.allergies : [],
      emergencyContactName: validatedValues.emergencyContactName,
      emergencyContactPhone: validatedValues.emergencyContactPhone,
      emergencyContactRelation: validatedValues.emergencyContactRelation,
      medicalNotes: validatedValues.medicalNotes,
    },
  })

  return updatedHealthInfo
}
