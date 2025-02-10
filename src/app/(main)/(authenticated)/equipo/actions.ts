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
import { NotificationType, Prisma } from "@prisma/client"
import { TeamData } from "@/types/team"
import { validateRequest } from "@/auth"
import { createNotification } from "@/lib/notificationHelpers"
import { DeleteEntityResult } from "@/lib/utils"

type TeamResult = {
  success: boolean
  member?: TeamData
  error?: string
}

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
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
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

      const member = await tx.user.create({
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

      await createNotification(
        tx,
        user.id,
        values.facilities.map((facility) => facility.id),
        NotificationType.USER_CREATED,
        member.id,
      )

      revalidatePath(`/equipo`)
      return { success: true, member }
    } catch (error) {
      console.error(error)
      return { success: false, error: "Error al crear integrante" }
    }
  })
}

export async function updateMember(
  id: string,
  values: UpdateMemberValues,
): Promise<TeamResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

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

      await createNotification(
        prismaClient,
        user.id,
        facilityIdsToConnect,
        NotificationType.USER_UPDATED,
      )

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
    if (!member) {
      throw new Error("No se pudo actualizar el miembro")
    }

    // Aserción de tipo para informar a TypeScript que member no es null
    const updatedMember = member as NonNullable<typeof member>

    return {
      success: true,
      member: {
        id: updatedMember.id,
        firstName: updatedMember.firstName ?? "",
        lastName: updatedMember.lastName ?? "",
        email: updatedMember.email ?? "",
        birthday: new Date(updatedMember.birthday) ?? new Date(),
        gender: updatedMember.gender ?? "",
        role: updatedMember.role ?? "USER",
        avatarUrl: updatedMember.avatarUrl ?? "",
        facilities: updatedMember.facilities.map((f) => ({
          id: f.facility.id ?? "",
          name: f.facility.name ?? "",
          logoUrl: f.facility.logoUrl ?? "",
        })),
        facilityId: updatedMember.facilities[0]?.facilityId ?? "",
      },
    }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Error al editar integrante" }
  }
}

export async function deleteMember(
  memberIds: string[],
): Promise<DeleteEntityResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  try {
    if (!memberIds || memberIds.length === 0) {
      throw new Error("No se proporcionaron IDs de miembros para eliminar")
    }

    const result = await prisma.$transaction(async (tx) => {
      const userFacilities = await tx.userFacility.findMany({
        where: {
          userId: { in: memberIds },
        },
        select: {
          userId: true,
          facilityId: true,
        },
      })

      const facilityIdsByUser = userFacilities.reduce(
        (acc, { userId, facilityId }) => {
          if (!acc[userId]) acc[userId] = []
          acc[userId].push(facilityId)
          return acc
        },
        {} as Record<string, string[]>,
      )

      await tx.userFacility.deleteMany({
        where: {
          userId: { in: memberIds },
        },
      })

      const { count } = await tx.user.deleteMany({
        where: {
          id: { in: memberIds },
        },
      })

      for (const userId of memberIds) {
        const facilityIds = facilityIdsByUser[userId] || []
        await createNotification(
          tx,
          user.id,
          facilityIds,
          NotificationType.USER_DELETED,
          userId,
        )
      }

      return count
    })

    if (result === 0) {
      throw new Error("No se encontraron integrantes para eliminar")
    }

    return {
      success: true,
      message: `Se ${result === 1 ? "ha" : "han"} eliminado ${result} ${result === 1 ? "miembro" : "miembros"} correctamente`,
      deletedCount: result,
    }
  } catch (error) {
    console.error("Error deleting member:", error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al eliminar integrantes",
    }
  }
}
