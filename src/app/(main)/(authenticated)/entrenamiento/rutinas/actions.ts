"use server"

import { revalidatePath } from "next/cache"
import { cache } from "react"
import { notFound } from "next/navigation"

import {
  PresetRoutineValues,
  RoutineValues,
  UserRoutineValues,
} from "@/lib/validation"
import prisma from "@/lib/prisma"
import { createNotification } from "@/lib/notificationHelpers"
import {
  NotificationType,
  Prisma,
  TransactionType,
  type DayOfWeek,
} from "@prisma/client"
import { validateRequest } from "@/auth"
import type {
  RoutineData,
  PresetRoutineData,
  UserRoutineData,
} from "@/types/routine"
import type { DeleteEntityResult } from "@/lib/utils"
import { createRoutineTransaction } from "@/lib/transactionHelpers"

type RoutineResult = {
  success: boolean
  routine?: RoutineData
  error?: string
}

type PresetRoutineResult = {
  success: boolean
  presetRoutine?: PresetRoutineData
  error?: string
}

type UserRoutineResult = {
  success: boolean
  userRoutine?: UserRoutineData
  error?: string
}

export const getRoutineById = cache(
  async (id: string): Promise<RoutineValues & { id: string }> => {
    try {
      const routine = await prisma.routine.findUnique({
        where: { id },
        include: {
          exercises: true,
        },
      })

      if (!routine) {
        notFound()
      }

      return {
        id: routine.id,
        name: routine.name,
        description: routine.description || "",
        facilityId: routine.facilityId,
        isActive: routine.isActive,
        exercises: routine.exercises.map((exercise) => ({
          name: exercise.name,
          bodyZone: exercise.bodyZone,
          series: exercise.series,
          count: exercise.count,
          measure: exercise.measure,
          rest: exercise.rest,
          description: exercise.description,
          photoUrl: exercise.photoUrl,
        })),
      }
    } catch (error) {
      console.error("Error fetching routine:", error)
      throw new Error("Failed to fetch routine")
    }
  },
)

export const getPresetRoutineById = cache(
  async (id: string): Promise<PresetRoutineValues & { id: string }> => {
    try {
      const presetRoutine = await prisma.presetRoutine.findUnique({
        where: { id },
        include: {
          exercises: true,
        },
      })

      if (!presetRoutine) {
        notFound()
      }

      return {
        id: presetRoutine.id,
        name: presetRoutine.name,
        description: presetRoutine.description || "",
        facilityId: presetRoutine.facilityId,
        isPublic: presetRoutine.isPublic,
        exercises: presetRoutine.exercises.map((exercise) => ({
          name: exercise.name,
          bodyZone: exercise.bodyZone,
          series: exercise.series,
          count: exercise.count,
          measure: exercise.measure,
          rest: exercise.rest,
          description: exercise.description,
          photoUrl: exercise.photoUrl,
        })),
      }
    } catch (error) {
      console.error("Error fetching preset routine:", error)
      throw new Error("Failed to fetch preset routine")
    }
  },
)

export const getUserRoutineById = cache(
  async (id: string): Promise<UserRoutineValues & { id: string }> => {
    try {
      const userRoutine = await prisma.userRoutine.findUnique({
        where: { id },
      })

      if (!userRoutine) {
        notFound()
      }

      return {
        id: userRoutine.id,
        userId: userRoutine.userId,
        routineId: userRoutine.routineId,
        dayOfWeek: userRoutine.dayOfWeek,
        isActive: userRoutine.isActive,
      }
    } catch (error) {
      console.error("Error fetching user routine:", error)
      throw new Error("Failed to fetch user routine")
    }
  },
)

export async function createRoutine(
  values: RoutineValues,
): Promise<RoutineResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      const routine = await tx.routine.create({
        data: {
          name: values.name,
          description: values.description ?? undefined,
          facilityId: values.facilityId,
          isActive: values.isActive,
          exercises: {
            create: values.exercises.map((exercise) => ({
              name: exercise.name,
              bodyZone: exercise.bodyZone,
              series: exercise.series,
              count: exercise.count,
              measure: exercise.measure,
              rest: exercise.rest ?? null,
              description: exercise.description ?? null,
              photoUrl: exercise.photoUrl ?? null,
            })),
          },
        },
        include: {
          exercises: true,
        },
      })

      /* await createRoutineTransaction({
        tx,
        type: TransactionType.ROUTINE_CREATED,
        routineId: routine.id,
        performedById: user.id,
        facilityId: routine.facilityId,
        details: {
          action: "Rutina creada",
          attachmentId: routine.id,
          attachmentName: routine.name,
        },
      }) */

      /* await createNotification(
        tx,
        user.id,
        values.facilityId,
        NotificationType.ROUTINE_CREATED,
        routine.id,
      ) */

      revalidatePath(`/rutinas`)
      return { success: true, routine }
    } catch (error) {
      console.error(error)
      return { success: false, error: "Error al crear la rutina" }
    }
  })
}

export async function createPresetRoutine(
  values: PresetRoutineValues,
): Promise<PresetRoutineResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      const presetRoutine = await tx.presetRoutine.create({
        data: {
          name: values.name,
          description: values.description ?? undefined,
          facilityId: values.facilityId,
          isPublic: values.isPublic,
          exercises: {
            create: values.exercises.map((exercise) => ({
              name: exercise.name,
              bodyZone: exercise.bodyZone,
              series: exercise.series,
              count: exercise.count,
              measure: exercise.measure,
              rest: exercise.rest ?? null,
              description: exercise.description ?? null,
              photoUrl: exercise.photoUrl ?? null,
            })),
          },
        },
        include: {
          exercises: true,
        },
      })

      await createRoutineTransaction({
        tx,
        type: TransactionType.ROUTINE_CREATED,
        routineId: presetRoutine.id,
        performedById: user.id,
        facilityId: presetRoutine.facilityId,
        details: {
          action: "Rutina preestablecida creada",
          attachmentId: presetRoutine.id,
          attachmentName: presetRoutine.name,
          isPreset: true,
        },
      })

      revalidatePath(`/rutinas/preestablecidas`)
      return { success: true, presetRoutine }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        error: "Error al crear la rutina preestablecida",
      }
    }
  })
}

export async function createUserRoutine(
  values: UserRoutineValues,
): Promise<UserRoutineResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      // Check if there's already a routine for this user on this day
      const existingUserRoutine = await tx.userRoutine.findFirst({
        where: {
          userId: values.userId,
          dayOfWeek: values.dayOfWeek,
        },
      })

      if (existingUserRoutine) {
        // Update the existing user routine
        const userRoutine = await tx.userRoutine.update({
          where: { id: existingUserRoutine.id },
          data: {
            routineId: values.routineId,
            isActive: values.isActive,
          },
          include: {
            routine: {
              include: {
                exercises: true,
              },
            },
          },
        })

        await createRoutineTransaction({
          tx,
          type: TransactionType.ROUTINE_UPDATED,
          routineId: values.routineId,
          performedById: user.id,
          facilityId: userRoutine.routine.facilityId,
          details: {
            action: "Rutina de usuario actualizada",
            attachmentId: userRoutine.id,
            userId: values.userId,
            dayOfWeek: values.dayOfWeek,
          },
        })

        revalidatePath(`/usuarios/${values.userId}/rutinas`)
        return { success: true, userRoutine }
      } else {
        // Create a new user routine
        const userRoutine = await tx.userRoutine.create({
          data: {
            userId: values.userId,
            routineId: values.routineId,
            dayOfWeek: values.dayOfWeek as DayOfWeek,
            isActive: values.isActive,
          },
          include: {
            routine: {
              include: {
                exercises: true,
              },
            },
          },
        })

        await createRoutineTransaction({
          tx,
          type: TransactionType.ROUTINE_CREATED,
          routineId: values.routineId,
          performedById: user.id,
          facilityId: userRoutine.routine.facilityId,
          details: {
            action: "Rutina asignada a usuario",
            attachmentId: userRoutine.id,
            userId: values.userId,
            dayOfWeek: values.dayOfWeek,
          },
        })

        revalidatePath(`/usuarios/${values.userId}/rutinas`)
        return { success: true, userRoutine }
      }
    } catch (error) {
      console.error(error)
      return { success: false, error: "Error al asignar la rutina al usuario" }
    }
  })
}

export async function updateRoutine(
  id: string,
  values: RoutineValues,
): Promise<RoutineResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      // Delete existing exercises
      await tx.exercise.deleteMany({
        where: { routineId: id },
      })

      // Update routine and create new exercises
      const routine = await tx.routine.update({
        where: { id },
        data: {
          name: values.name,
          description: values.description,
          facilityId: values.facilityId,
          isActive: values.isActive,
          exercises: {
            create: values.exercises.map((exercise) => ({
              name: exercise.name,
              bodyZone: exercise.bodyZone,
              series: exercise.series,
              count: exercise.count,
              measure: exercise.measure,
              rest: exercise.rest ?? null,
              description: exercise.description ?? null,
              photoUrl: exercise.photoUrl ?? null,
            })),
          },
        },
        include: {
          exercises: true,
        },
      })

      await createRoutineTransaction({
        tx,
        type: TransactionType.ROUTINE_UPDATED,
        routineId: routine.id,
        performedById: user.id,
        facilityId: routine.facilityId,
        details: {
          action: "Rutina actualizada",
          attachmentId: routine.id,
          attachmentName: routine.name,
        },
      })

      await createNotification(
        tx,
        user.id,
        values.facilityId,
        NotificationType.ROUTINE_UPDATED,
        routine.id,
      )

      revalidatePath(`/rutinas`)
      return { success: true, routine }
    } catch (error) {
      console.error(error)
      return { success: false, error: "Error al actualizar la rutina" }
    }
  })
}

export async function updatePresetRoutine(
  id: string,
  values: PresetRoutineValues,
): Promise<PresetRoutineResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      // Delete existing exercises
      await tx.exercise.deleteMany({
        where: { presetRoutineId: id },
      })

      // Update preset routine and create new exercises
      const presetRoutine = await tx.presetRoutine.update({
        where: { id },
        data: {
          name: values.name,
          description: values.description,
          facilityId: values.facilityId,
          isPublic: values.isPublic,
          exercises: {
            create: values.exercises.map((exercise) => ({
              name: exercise.name,
              bodyZone: exercise.bodyZone,
              series: exercise.series,
              count: exercise.count,
              measure: exercise.measure,
              rest: exercise.rest ?? null,
              description: exercise.description ?? null,
              photoUrl: exercise.photoUrl ?? null,
            })),
          },
        },
        include: {
          exercises: true,
        },
      })

      await createRoutineTransaction({
        tx,
        type: TransactionType.ROUTINE_UPDATED,
        routineId: presetRoutine.id,
        performedById: user.id,
        facilityId: presetRoutine.facilityId,
        details: {
          action: "Rutina preestablecida actualizada",
          attachmentId: presetRoutine.id,
          attachmentName: presetRoutine.name,
          isPreset: true,
        },
      })

      revalidatePath(`/rutinas/preestablecidas`)
      return { success: true, presetRoutine }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        error: "Error al actualizar la rutina preestablecida",
      }
    }
  })
}

export async function deleteRoutines(
  routineIds: string[],
  facilityId: string,
): Promise<DeleteEntityResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma
    .$transaction(
      async (tx) => {
        try {
          const routines = await tx.routine.findMany({
            where: {
              id: { in: routineIds },
            },
            select: {
              id: true,
              name: true,
            },
          })

          if (routines.length === 0) {
            return {
              success: false,
              message: "No se encontraron rutinas para eliminar",
            }
          }

          // Count user routines that will be affected
          const userRoutinesCount = await tx.userRoutine.count({
            where: {
              routineId: { in: routineIds },
            },
          })

          for (const routine of routines) {
            await createRoutineTransaction({
              tx,
              type: TransactionType.ROUTINE_DELETED,
              routineId: routine.id,
              performedById: user.id,
              facilityId,
              details: {
                action: "Rutina borrada",
                attachmentId: routine.id,
                attachmentName: routine.name,
                affectedUserRoutinesCount: userRoutinesCount,
              },
            })
          }

          await createNotification(
            tx,
            user.id,
            facilityId,
            NotificationType.ROUTINE_DELETED,
          )

          // Delete exercises first
          await tx.exercise.deleteMany({
            where: {
              routineId: { in: routineIds },
            },
          })

          // Delete user routines
          await tx.userRoutine.deleteMany({
            where: {
              routineId: { in: routineIds },
            },
          })

          // Delete routines
          const { count } = await tx.routine.deleteMany({
            where: {
              id: { in: routineIds },
            },
          })

          revalidatePath("/rutinas")

          return {
            success: true,
            message: `Se ${count === 1 ? "ha" : "han"} eliminado ${count} ${
              count === 1 ? "rutina" : "rutinas"
            } y ${userRoutinesCount} ${userRoutinesCount === 1 ? "asignación de usuario" : "asignaciones de usuarios"} correctamente`,
            deletedCount: count,
            affectedUserRoutinesCount: userRoutinesCount,
          }
        } catch (error) {
          console.error("Error deleting routines:", error)
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
            : "Error al eliminar las rutinas",
      }
    })
}

export async function deletePresetRoutines(
  presetRoutineIds: string[],
  facilityId: string,
): Promise<DeleteEntityResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma
    .$transaction(
      async (tx) => {
        try {
          const presetRoutines = await tx.presetRoutine.findMany({
            where: {
              id: { in: presetRoutineIds },
            },
            select: {
              id: true,
              name: true,
            },
          })

          if (presetRoutines.length === 0) {
            return {
              success: false,
              message:
                "No se encontraron rutinas preestablecidas para eliminar",
            }
          }

          for (const presetRoutine of presetRoutines) {
            await createRoutineTransaction({
              tx,
              type: TransactionType.ROUTINE_DELETED,
              routineId: presetRoutine.id,
              performedById: user.id,
              facilityId,
              details: {
                action: "Rutina preestablecida borrada",
                attachmentId: presetRoutine.id,
                attachmentName: presetRoutine.name,
                isPreset: true,
              },
            })
          }

          // Delete exercises first
          await tx.exercise.deleteMany({
            where: {
              presetRoutineId: { in: presetRoutineIds },
            },
          })

          // Delete preset routines
          const { count } = await tx.presetRoutine.deleteMany({
            where: {
              id: { in: presetRoutineIds },
            },
          })

          revalidatePath("/rutinas/preestablecidas")

          return {
            success: true,
            message: `Se ${count === 1 ? "ha" : "han"} eliminado ${count} ${
              count === 1 ? "rutina preestablecida" : "rutinas preestablecidas"
            } correctamente`,
            deletedCount: count,
          }
        } catch (error) {
          console.error("Error deleting preset routines:", error)
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
            : "Error al eliminar las rutinas preestablecidas",
      }
    })
}

export async function createRoutineFromPreset(
  presetRoutineId: string,
  facilityId: string,
): Promise<RoutineResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      const presetRoutine = await tx.presetRoutine.findUnique({
        where: { id: presetRoutineId },
        include: { exercises: true },
      })

      if (!presetRoutine) {
        return { success: false, error: "Rutina preestablecida no encontrada" }
      }

      const routine = await tx.routine.create({
        data: {
          name: presetRoutine.name,
          description: presetRoutine.description,
          facilityId: facilityId,
          isActive: true,
          exercises: {
            create: presetRoutine.exercises.map((exercise) => ({
              name: exercise.name,
              bodyZone: exercise.bodyZone,
              series: exercise.series,
              count: exercise.count,
              measure: exercise.measure,
              rest: exercise.rest,
              description: exercise.description,
              photoUrl: exercise.photoUrl,
            })),
          },
        },
        include: {
          exercises: true,
        },
      })

      await createRoutineTransaction({
        tx,
        type: TransactionType.ROUTINE_CREATED,
        routineId: routine.id,
        performedById: user.id,
        facilityId: routine.facilityId,
        details: {
          action: "Rutina creada desde preestablecida",
          attachmentId: routine.id,
          attachmentName: routine.name,
          presetRoutineId: presetRoutine.id,
          presetRoutineName: presetRoutine.name,
        },
      })

      await createNotification(
        tx,
        user.id,
        facilityId,
        NotificationType.ROUTINE_CREATED,
        routine.id,
      )

      revalidatePath(`/rutinas`)
      return { success: true, routine }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        error: "Error al crear la rutina desde la preestablecida",
      }
    }
  })
}
