/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { revalidatePath } from "next/cache"
import { cache } from "react"
import { notFound } from "next/navigation"
import { hash } from "@node-rs/argon2"

import {
  memberSchema,
  MemberValues,
  updateMemberSchema,
  UpdateMemberValues,
} from "@/lib/validation"
import prisma from "@/lib/prisma"
import { generateIdFromEntropySize } from "lucia"
import { Prisma } from "@prisma/client"

export const getMemberById = cache(
  async (id: string): Promise<MemberValues & { id: string }> => {
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
        avatarUrl: member.avatarUrl || null,
        password: member.passwordHash || "",
        confirmPassword: member.passwordHash || "",
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

export async function createMember(values: MemberValues) {
  try {
    const {
      firstName,
      lastName,
      email,
      gender,
      birthday,
      avatarUrl,
      role,
      facilities,
      password,
    } = memberSchema.parse(values)

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
        firstName,
        lastName,
        email,
        passwordHash,
        gender,
        birthday,
        role,
        avatarUrl,
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
    return { error: "Error al crear integrante" }
  }
}

export async function updateMember(id: string, values: UpdateMemberValues) {
  try {
    if (!values || typeof values !== "object") {
      throw new Error("Invalid input: values must be an object")
    }

    const validatedData = updateMemberSchema.parse(values)

    const currentUser = await prisma.user.findUnique({
      where: { id },
      include: { facilities: true },
    })

    if (!currentUser) {
      throw new Error(`User with id ${id} not found`)
    }

    const currentFacilityIds = currentUser.facilities.map((f) => f.facilityId)
    const newFacilityIds = Array.isArray(validatedData.facilities)
      ? validatedData.facilities.map((f) => f.id)
      : []

    const facilityIdsToConnect = newFacilityIds.filter(
      (id) => !currentFacilityIds.includes(id),
    )
    const facilityIdsToDisconnect = currentFacilityIds.filter(
      (id) => !newFacilityIds.includes(id),
    )

    const updateData: Prisma.UserUpdateInput = {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      gender: validatedData.gender,
      birthday: validatedData.birthday,
      role: validatedData.role,
      avatarUrl: validatedData.avatarUrl,
    }

    const member = await prisma.$transaction(async (prismaClient) => {
      const updatedUser = await prismaClient.user.update({
        where: { id },
        data: updateData,
        include: {
          facilities: {
            include: {
              facility: true,
            },
          },
        },
      })

      if (facilityIdsToDisconnect.length > 0) {
        await prismaClient.userFacility.deleteMany({
          where: {
            userId: id,
            facilityId: { in: facilityIdsToDisconnect },
          },
        })
      }

      if (facilityIdsToConnect.length > 0) {
        await prismaClient.userFacility.createMany({
          data: facilityIdsToConnect.map((facilityId) => ({
            userId: id,
            facilityId,
          })),
        })
      }

      return prismaClient.user.findUnique({
        where: { id },
        include: {
          facilities: {
            include: {
              facility: true,
            },
          },
        },
      })
    })

    revalidatePath(`/equipo`)
    return { success: true, member }
  } catch (error) {
    console.error("Error in updateMember:", error)
    if (error instanceof Error) {
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    return {
      error:
        error instanceof Error
          ? error.message
          : "Error al actualizar al integrante del equipo",
      details: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    }
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
      throw new Error("No se encontraron integrantes para eliminar")
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
          : "Error al eliminar a los integrantes",
    }
  }
}
