/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { revalidatePath } from "next/cache"
import { cache } from "react"
import { notFound } from "next/navigation"
import { hash } from "@node-rs/argon2"

import { teamSchema, TeamValues } from "@/lib/validation"
import prisma from "@/lib/prisma"
import { generateIdFromEntropySize } from "lucia"

export const getMemberById = cache(
  async (id: string): Promise<TeamValues & { id: string }> => {
    try {
      const member = await prisma.user.findUnique({
        where: { id },
        include: {
          facilities: {
            select: {
              facility: {
                select: {
                  id: true,
                  name: true,
                  logoUrl: true,
                },
              },
            },
          },
        },
      })

      if (!member) {
        notFound()
      }

      return {
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email || "",
        gender: member.gender,
        birthday: member.birthday,
        role: member.role,
        avatarUrl: member.avatarUrl,
        password: "",
        confirmPassword: "",
        facilities: member.facilities.map((facility) => ({
          id: facility.facility.id,
          name: facility.facility.name,
          logoUrl: facility.facility.logoUrl || "",
        })),
      }
    } catch (error) {
      console.error("Error fetching activity:", error)
      throw new Error("Failed to fetch activity")
    }
  },
)

export async function createMember(values: TeamValues) {
  try {
    const {
      firstName,
      lastName,
      email,
      gender,
      birthday,
      role,
      avatarUrl,
      facilities,
      password,
    } = teamSchema.parse(values)

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    })

    const userId = generateIdFromEntropySize(10)

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    })

    if (existingEmail) {
      return { error: "El email ingresado ya está en uso." }
    }

    const member = await prisma.user.create({
      data: {
        id: userId,
        firstName: firstName,
        lastName: lastName,
        email: email,
        passwordHash,
        gender: gender,
        birthday: birthday,
        role: role,
        avatarUrl: avatarUrl,
        facilities: {
          create: facilities.map((facility) => ({
            facilityId: facility.id,
          })),
        },
      },
      include: {
        facilities: {
          include: {
            facility: true,
          },
        },
      },
    })

    revalidatePath(`/equipo`)
    return { success: true, member }
  } catch (error) {
    console.error(error)
    return { error: "Error al crear miembro" }
  }
}

export async function updateMember(id: string, values: TeamValues) {
  try {
    const updateData: Partial<TeamValues & { password?: string }> = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      gender: values.gender,
      birthday: values.birthday,
      role: values.role,
      avatarUrl: values.avatarUrl,
    }

    if (values.password) {
      updateData.password = await hash(values.password)
    }

    const currentFacilities = await prisma.userFacility.findMany({
      where: { userId: id },
      select: { facilityId: true },
    })
    const currentFacilityIds = currentFacilities.map((f) => f.facilityId)

    const newFacilityIds = values.facilities.map((f) => f.id)
    const facilityIdsToConnect = newFacilityIds.filter(
      (id) => !currentFacilityIds.includes(id),
    )
    const facilityIdsToDisconnect = currentFacilityIds.filter(
      (id) => !newFacilityIds.includes(id),
    )

    const member = await prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        facilities: {
          disconnect: facilityIdsToDisconnect.map((facilityId) => ({
            userId_facilityId: { userId: id, facilityId },
          })),
          connect: facilityIdsToConnect.map((facilityId) => ({
            userId_facilityId: { userId: id, facilityId },
          })),
        },
      },
      include: {
        facilities: {
          include: {
            facility: true,
          },
        },
      },
    })

    revalidatePath(`/equipo`)
    return { success: true, member }
  } catch (error) {
    console.error(error)
    return { error: "Error al actualizar al miembro del equipo" }
  }
}

export async function deleteMember(memberIds: string[]) {
  try {
    const { count } = await prisma.user.deleteMany({
      where: {
        id: { in: memberIds },
      },
    })

    if (count === 0) {
      throw new Error("No se encontraron miembros para eliminar")
    }

    return {
      success: true,
      message: `Se ${count === 1 ? "ha" : "han"} eliminado ${count} ${count === 1 ? "miebro" : "miebros"} correctamente`,
      deletedCount: count,
    }
  } catch (error) {
    console.error("Error deleting members:", error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al eliminar a los miembros",
    }
  }
}
