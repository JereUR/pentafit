/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { revalidatePath } from "next/cache"
import { cache } from "react"
import { notFound } from "next/navigation"
import { hash } from "@node-rs/argon2"

import {
  memberSchema,
  type MemberValues,
  updateMemberSchema,
  type UpdateMemberValues,
} from "@/lib/validation"
import prisma from "@/lib/prisma"
import { generateIdFromEntropySize } from "lucia"
import { Prisma, type Role, TransactionType } from "@prisma/client"
import { validateRequest } from "@/auth"
import type { DeleteEntityResult } from "@/lib/utils"
import {
  createStaffTransaction,
  createClientTransaction,
} from "@/lib/transactionHelpers"

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
      console.error("Error fetching user:", error)
      throw new Error("Failed to fetch user")
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

      const existingEmail = await tx.user.findFirst({
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

      // Use the appropriate transaction type based on role
      if (role === "STAFF" || role === "ADMIN" || role === "SUPER_ADMIN") {
        await createStaffTransaction({
          tx,
          type: TransactionType.STAFF_CREATED,
          targetUserId: member.id,
          performedById: user.id,
          facilityId: facilities[0].id, // Using first facility
          details: {
            action: "Miembro del equipo creado",
            attachmentId: member.id,
            attachmentName: `${member.firstName} ${member.lastName}`,
            role: member.role,
          },
        })
      } else {
        await createClientTransaction({
          tx,
          type: TransactionType.CLIENT_CREATED,
          targetUserId: member.id,
          performedById: user.id,
          facilityId: facilities[0].id, // Using first facility
          details: {
            action: "Cliente creado",
            attachmentId: member.id,
            attachmentName: `${member.firstName} ${member.lastName}`,
          },
        })
      }

      revalidatePath(`/equipo`)
      return { success: true, member }
    } catch (error) {
      console.error(error)
      return { error: "Error al crear integrante" }
    }
  })
}

export async function updateMember(id: string, values: UpdateMemberValues) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      if (!values || typeof values !== "object") {
        throw new Error("Invalid input: values must be an object")
      }

      const validatedData = updateMemberSchema.parse(values)

      const currentUser = await tx.user.findUnique({
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

      const updatedUser = await tx.user.update({
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
        await tx.userFacility.deleteMany({
          where: {
            userId: id,
            facilityId: { in: facilityIdsToDisconnect },
          },
        })
      }

      if (facilityIdsToConnect.length > 0) {
        await tx.userFacility.createMany({
          data: facilityIdsToConnect.map((facilityId) => ({
            userId: id,
            facilityId,
          })),
        })
      }

      const member = await tx.user.findUnique({
        where: { id },
        include: {
          facilities: {
            include: {
              facility: true,
            },
          },
        },
      })

      if (!member) {
        throw new Error(`User with id ${id} not found`)
      }

      if (
        validatedData.role === "STAFF" ||
        validatedData.role === "ADMIN" ||
        validatedData.role === "SUPER_ADMIN"
      ) {
        await createStaffTransaction({
          tx,
          type: TransactionType.STAFF_UPDATED,
          targetUserId: member.id,
          performedById: user.id,
          facilityId: member.facilities[0].facilityId,
          details: {
            action: "Miembro del equipo actualizado",
            attachmentId: member.id,
            attachmentName: `${member.firstName} ${member.lastName}`,
            role: member.role,
          },
        })
      } else {
        await createClientTransaction({
          tx,
          type: TransactionType.CLIENT_UPDATED,
          targetUserId: member.id,
          performedById: user.id,
          facilityId: member.facilities[0].facilityId,
          details: {
            action: "Cliente actualizado",
            attachmentId: member.id,
            attachmentName: `${member.firstName} ${member.lastName}`,
          },
        })
      }

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
  })
}

export async function deleteMembers(
  memberIds: string[],
  facilityId: string,
): Promise<DeleteEntityResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma
    .$transaction(
      async (tx) => {
        try {
          if (!memberIds || memberIds.length === 0) {
            throw new Error(
              "No se proporcionaron IDs de miembros para eliminar",
            )
          }

          const members = await tx.user.findMany({
            where: {
              id: { in: memberIds },
            },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          })

          if (members.length === 0) {
            return {
              success: false,
              message: "No se encontraron integrantes para eliminar",
            }
          }

          for (const member of members) {
            if (
              member.role === "STAFF" ||
              member.role === "ADMIN" ||
              member.role === "SUPER_ADMIN"
            ) {
              await createStaffTransaction({
                tx,
                type: TransactionType.STAFF_DELETED,
                targetUserId: member.id,
                performedById: user.id,
                facilityId,
                details: {
                  action: "Miembro del equipo eliminado",
                  attachmentId: member.id,
                  attachmentName: `${member.firstName} ${member.lastName}`,
                  role: member.role,
                },
              })
            } else {
              await createClientTransaction({
                tx,
                type: TransactionType.CLIENT_DELETED,
                targetUserId: member.id,
                performedById: user.id,
                facilityId,
                details: {
                  action: "Cliente eliminado",
                  attachmentId: member.id,
                  attachmentName: `${member.firstName} ${member.lastName}`,
                },
              })
            }
          }

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

          revalidatePath("/equipo")

          return {
            success: true,
            message: `Se ${count === 1 ? "ha" : "han"} eliminado ${count} ${
              count === 1 ? "miembro" : "miembros"
            } correctamente`,
            deletedCount: count,
          }
        } catch (error) {
          console.error("Error deleting members:", error)
          throw error
        }
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000,
        timeout: 10000,
      },
    )
    .catch((error) => {
      console.error("Transaction failed:", error)
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al eliminar los miembros",
      }
    })
}

export async function updateMemberRole(
  id: string,
  newRole: Role,
  facilityId: string,
): Promise<{ success: boolean; error?: string }> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma
    .$transaction(async (tx) => {
      const member = await tx.user.findUnique({
        where: { id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      })

      if (!member) {
        return { success: false, error: "Miembro no encontrado" }
      }

      const oldRole = member.role

      const updatedMember = await tx.user.update({
        where: { id },
        data: { role: newRole },
      })

      await createStaffTransaction({
        tx,
        type: TransactionType.STAFF_ROLE_CHANGED,
        targetUserId: member.id,
        performedById: user.id,
        facilityId,
        details: {
          action: "Rol de miembro cambiado",
          attachmentId: member.id,
          attachmentName: `${member.firstName} ${member.lastName}`,
          oldRole,
          newRole,
        },
      })

      revalidatePath(`/equipo`)
      return { success: true }
    })
    .catch((error) => {
      console.error("Error updating member role:", error)
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error al actualizar el rol del miembro",
      }
    })
}
