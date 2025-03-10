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
        routineId: routine.id,
        performedById: user.id,
        facilityId: routine.facilityId,
        details: {
          action: "Rutina creada",
          attachmentId: routine.id,
          attachmentName: routine.name,
        },
      })

      await createNotification({
        tx,
        issuerId: user.id,
        facilityId: values.facilityId,
        type: NotificationType.ROUTINE_CREATED,
        relatedId: routine.id,
      })

      revalidatePath(`/rutinas`)
      return { success: true, routine }
    } catch (error) {
      console.error(error)
      return { success: false, error: "Error al crear la rutina" }
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
      await tx.exercise.deleteMany({
        where: { routineId: id },
      })

      const routine = await tx.routine.update({
        where: { id },
        data: {
          name: values.name,
          description: values.description,
          facilityId: values.facilityId,
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

      await createNotification({
        tx,
        issuerId: user.id,
        facilityId: values.facilityId,
        type: NotificationType.ROUTINE_UPDATED,
        relatedId: routine.id,
      })

      revalidatePath(`/rutinas`)
      return { success: true, routine }
    } catch (error) {
      console.error(error)
      return { success: false, error: "Error al actualizar la rutina" }
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

          await createNotification({
            tx,
            issuerId: user.id,
            facilityId,
            type: NotificationType.ROUTINE_DELETED,
          })

          await tx.exercise.deleteMany({
            where: {
              routineId: { in: routineIds },
            },
          })

          await tx.userRoutine.deleteMany({
            where: {
              routineId: { in: routineIds },
            },
          })

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

export async function replicateRoutines(
  routineIds: string[],
  targetFacilityIds: string[],
) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma
    .$transaction(async (tx) => {
      const routines = await tx.routine.findMany({
        where: { id: { in: routineIds } },
        include: {
          exercises: true,
        },
      })

      if (routines.length === 0) {
        return {
          success: false,
          message: "No se encontraron rutinas para replicar",
        }
      }

      const targetFacilities = await tx.facility.findMany({
        where: { id: { in: targetFacilityIds } },
        select: {
          id: true,
          name: true,
          logoUrl: true,
        },
      })

      const replicationResults = await Promise.all(
        targetFacilityIds.flatMap(async (targetFacilityId) =>
          Promise.all(
            routines.map(async (sourceRoutine) => {
              const {
                id: sourceId,
                facilityId: sourceFacilityId,
                exercises,
                ...routineData
              } = sourceRoutine

              const replicatedRoutine = await tx.routine.create({
                data: {
                  ...routineData,
                  facilityId: targetFacilityId,
                  exercises: {
                    create: exercises.map(
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      ({ id, routineId, presetRoutineId, ...exerciseData }) =>
                        exerciseData,
                    ),
                  },
                },
              })

              await createRoutineTransaction({
                tx,
                type: TransactionType.ROUTINE_REPLICATED,
                routineId: sourceId,
                performedById: user.id,
                facilityId: sourceFacilityId,
                details: {
                  action: "Rutina replicada",
                  sourceRoutineId: sourceId,
                  sourceRoutineName: sourceRoutine.name,
                  sourceFacilityId: sourceFacilityId,
                  targetFacilityId: targetFacilityId,
                  replicatedRoutineId: replicatedRoutine.id,
                  replicatedRoutineName: replicatedRoutine.name,
                  exercisesCount: exercises.length,
                  targetFacilities: targetFacilities.map((facility) => ({
                    id: facility.id,
                    name: facility.name,
                    logoUrl: facility.logoUrl,
                  })),
                },
              })

              return {
                sourceRoutine,
                replicatedRoutine,
                targetFacilityId,
              }
            }),
          ),
        ),
      )

      const flattenedResults = replicationResults.flat()

      await Promise.all(
        targetFacilityIds.map((facilityId) =>
          createNotification({
            tx,
            issuerId: user.id,
            facilityId,
            type: NotificationType.ROUTINE_REPLICATED,
          }),
        ),
      )

      revalidatePath(`/entrenamiento/rutinas`)
      return {
        success: true,
        message: `Se han replicado ${flattenedResults.length} rutinas en ${targetFacilityIds.length} establecimientos.`,
        replicatedCount: flattenedResults.length,
        details: {
          replicatedRoutines: flattenedResults.map((result) => ({
            sourceId: result.sourceRoutine.id,
            sourceName: result.sourceRoutine.name,
            replicatedId: result.replicatedRoutine.id,
            targetFacilityId: result.targetFacilityId,
          })),
        },
      }
    })
    .catch((error) => {
      console.error("Error replicating routines:", error)
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al replicar las rutinas",
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
      const existingUserRoutine = await tx.userRoutine.findFirst({
        where: {
          userId: values.userId,
          dayOfWeek: values.dayOfWeek,
        },
      })

      if (existingUserRoutine) {
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

export async function updatePresetRoutine(
  id: string,
  values: PresetRoutineValues,
): Promise<PresetRoutineResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      await tx.exercise.deleteMany({
        where: { presetRoutineId: id },
      })

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

          await tx.exercise.deleteMany({
            where: {
              presetRoutineId: { in: presetRoutineIds },
            },
          })

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

      await createNotification({
        tx,
        issuerId: user.id,
        facilityId,
        type: NotificationType.ROUTINE_CREATED,
        relatedId: routine.id,
      })

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
