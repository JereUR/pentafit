/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { revalidatePath } from "next/cache"
import { cache } from "react"
import { notFound } from "next/navigation"

import { DailyExercisesValues, RoutineValues } from "@/lib/validation"
import prisma from "@/lib/prisma"
import { createNotification } from "@/lib/notificationHelpers"
import {
  NotificationType,
  Prisma,
  TransactionType,
  type DayOfWeek,
} from "@prisma/client"
import { validateRequest } from "@/auth"
import type { RoutineData } from "@/types/routine"
import type { DeleteEntityResult } from "@/lib/utils"
import { createRoutineTransaction } from "@/lib/transactionHelpers"
import { TransactionDetails } from "@/types/transactions"

type RoutineResult = {
  success: boolean
  routine?: RoutineData | null
  error?: string
}

export const getRoutineById = cache(
  async (id: string): Promise<RoutineValues & { id: string }> => {
    try {
      const routine = await prisma.routine.findUnique({
        where: { id },
        include: {
          dailyExercises: {
            include: {
              exercises: true,
            },
          },
        },
      })

      if (!routine) {
        notFound()
      }

      const dailyExercises: DailyExercisesValues = {
        MONDAY: [],
        TUESDAY: [],
        WEDNESDAY: [],
        THURSDAY: [],
        FRIDAY: [],
        SATURDAY: [],
        SUNDAY: [],
      }

      routine.dailyExercises.forEach((dailyExercise) => {
        const day = dailyExercise.dayOfWeek
        dailyExercises[day] = dailyExercise.exercises.map((exercise) => ({
          name: exercise.name,
          bodyZone: exercise.bodyZone,
          series: exercise.series,
          count: exercise.count,
          measure: exercise.measure,
          rest: exercise.rest,
          description: exercise.description,
          photoUrl: exercise.photoUrl,
        }))
      })

      return {
        id: routine.id,
        name: routine.name,
        description: routine.description || "",
        facilityId: routine.facilityId,
        dailyExercises,
      }
    } catch (error) {
      console.error("Error fetching routine:", error)
      throw new Error("Failed to fetch routine")
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
        },
      })

      const daysOfWeek = Object.keys(values.dailyExercises) as DayOfWeek[]

      for (const day of daysOfWeek) {
        const exercises = values.dailyExercises[day]

        if (exercises.length > 0) {
          const dailyExercise = await tx.dailyExercise.create({
            data: {
              dayOfWeek: day,
              routineId: routine.id,
            },
          })

          await tx.exercise.createMany({
            data: exercises.map((exercise) => ({
              name: exercise.name,
              bodyZone: exercise.bodyZone,
              series: exercise.series,
              count: exercise.count,
              measure: exercise.measure,
              rest: exercise.rest ?? null,
              description: exercise.description ?? null,
              photoUrl: exercise.photoUrl ?? null,
              dailyExerciseId: dailyExercise.id,
            })),
          })
        }
      }

      const routineData = await tx.routine.findUnique({
        where: { id: routine.id },
        include: {
          dailyExercises: {
            include: {
              exercises: true,
            },
          },
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

      revalidatePath(`/entrenamiento/rutinas`)
      return { success: true, routine: routineData }
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
      await tx.routine.update({
        where: { id },
        data: {
          name: values.name,
          description: values.description,
          facilityId: values.facilityId,
        },
      })

      const existingDailyExercises = await tx.dailyExercise.findMany({
        where: { routineId: id },
        include: { exercises: true },
      })

      const daysOfWeek = Object.keys(values.dailyExercises) as DayOfWeek[]

      for (const day of daysOfWeek) {
        const exercises = values.dailyExercises[day]
        const existingDailyExercise = existingDailyExercises.find(
          (de) => de.dayOfWeek === day,
        )

        if (exercises.length > 0) {
          if (existingDailyExercise) {
            await tx.exercise.deleteMany({
              where: { dailyExerciseId: existingDailyExercise.id },
            })

            await tx.exercise.createMany({
              data: exercises.map((exercise) => ({
                name: exercise.name,
                bodyZone: exercise.bodyZone,
                series: exercise.series,
                count: exercise.count,
                measure: exercise.measure,
                rest: exercise.rest ?? null,
                description: exercise.description ?? null,
                photoUrl: exercise.photoUrl ?? null,
                dailyExerciseId: existingDailyExercise.id,
              })),
            })
          } else {
            const dailyExercise = await tx.dailyExercise.create({
              data: {
                dayOfWeek: day,
                routineId: id,
              },
            })

            await tx.exercise.createMany({
              data: exercises.map((exercise) => ({
                name: exercise.name,
                bodyZone: exercise.bodyZone,
                series: exercise.series,
                count: exercise.count,
                measure: exercise.measure,
                rest: exercise.rest ?? null,
                description: exercise.description ?? null,
                photoUrl: exercise.photoUrl ?? null,
                dailyExerciseId: dailyExercise.id,
              })),
            })
          }
        } else if (existingDailyExercise) {
          await tx.dailyExercise.delete({
            where: { id: existingDailyExercise.id },
          })
        }
      }

      const routineData = await tx.routine.findUnique({
        where: { id },
        include: {
          dailyExercises: {
            include: {
              exercises: true,
            },
          },
        },
      })

      await createRoutineTransaction({
        tx,
        type: TransactionType.ROUTINE_UPDATED,
        routineId: id,
        performedById: user.id,
        facilityId: values.facilityId,
        details: {
          action: "Rutina actualizada",
          attachmentId: id,
          attachmentName: values.name,
        },
      })

      await createNotification({
        tx,
        issuerId: user.id,
        facilityId: values.facilityId,
        type: NotificationType.ROUTINE_UPDATED,
        relatedId: id,
      })

      revalidatePath(`/entrenamiento/rutinas`)
      return { success: true, routine: routineData }
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

          revalidatePath("/entrenamiento/rutinas")

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

type ReplicationResult = {
  sourceRoutine: RoutineData
  replicatedRoutine: RoutineData | null
  targetFacilityId: string
}

export async function replicateRoutines(
  routineIds: string[],
  targetFacilityIds: string[],
) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma
    .$transaction(
      async (tx) => {
        const routines = await tx.routine.findMany({
          where: {
            id: { in: routineIds },
          },
          include: {
            dailyExercises: {
              include: {
                exercises: true,
              },
            },
          },
        })

        if (routines.length === 0) {
          return {
            success: false,
            message: "No se encontraron rutinas para replicar",
          }
        }

        const targetFacilities = await tx.facility.findMany({
          where: {
            id: { in: targetFacilityIds },
          },
          select: {
            id: true,
            name: true,
            logoUrl: true,
          },
        })

        if (targetFacilities.length === 0) {
          return {
            success: false,
            message: "No se encontraron establecimientos destino",
          }
        }

        const replicationResults: ReplicationResult[] = []

        for (const targetFacility of targetFacilities) {
          for (const sourceRoutine of routines) {
            try {
              const {
                id: sourceId,
                facilityId: sourceFacilityId,
                dailyExercises,
                ...routineData
              } = sourceRoutine

              const replicatedRoutine = await tx.routine.create({
                data: {
                  ...routineData,
                  facilityId: targetFacility.id,
                },
              })

              for (const dailyExercise of dailyExercises) {
                const {
                  id: dailyExId,
                  exercises,
                  ...dailyExData
                } = dailyExercise

                const newDailyExercise = await tx.dailyExercise.create({
                  data: {
                    ...dailyExData,
                    routineId: replicatedRoutine.id,
                  },
                })

                for (const exercise of exercises) {
                  const {
                    id: exerciseId,
                    dailyExerciseId,
                    ...exerciseData
                  } = exercise

                  await tx.exercise.create({
                    data: {
                      ...exerciseData,
                      dailyExerciseId: newDailyExercise.id,
                    },
                  })
                }
              }

              const completeReplicatedRoutine = await tx.routine.findUnique({
                where: { id: replicatedRoutine.id },
                include: {
                  dailyExercises: {
                    include: {
                      exercises: true,
                    },
                  },
                },
              })

              const transactionDetails = {
                action: "Rutina replicada",
                sourceId: sourceId,
                sourceName: sourceRoutine.name,
                sourceFacilityId: sourceFacilityId,
                targetFacilityId: targetFacility.id,
                replicatedId: replicatedRoutine.id,
                replicatedName: replicatedRoutine.name,
                exercisesCount: dailyExercises.reduce(
                  (count, de) => count + de.exercises.length,
                  0,
                ),
                targetFacilities: targetFacilities.map((facility) => ({
                  id: facility.id,
                  name: facility.name,
                  logoUrl: facility.logoUrl,
                })),
                timestamp: new Date().toISOString(),
              }

              await createRoutineTransaction({
                tx,
                type: TransactionType.ROUTINE_REPLICATED,
                routineId: sourceId,
                performedById: user.id,
                facilityId: sourceFacilityId,
                details: transactionDetails,
              })

              replicationResults.push({
                sourceRoutine,
                replicatedRoutine: completeReplicatedRoutine,
                targetFacilityId: targetFacility.id,
              })
            } catch (error) {
              console.error(
                `Error replicating routine ${sourceRoutine.id} to facility ${targetFacility.id}:`,
                error,
              )
              throw error
            }
          }
        }

        await Promise.all(
          targetFacilityIds.map((facilityId) => {
            const relatedRoutineId = replicationResults.find(
              (r) => r.targetFacilityId === facilityId,
            )?.replicatedRoutine?.id

            return createNotification({
              tx,
              issuerId: user.id,
              facilityId,
              type: NotificationType.ROUTINE_REPLICATED,
              relatedId: relatedRoutineId,
            })
          }),
        )

        revalidatePath(`/entrenamiento/rutinas`)
        return {
          success: true,
          message: `Se han replicado ${replicationResults.length} rutinas en ${targetFacilities.length} establecimientos.`,
          replicatedCount: replicationResults.length,
          details: {
            replicatedRoutines: replicationResults.map((result) => ({
              sourceId: result.sourceRoutine.id,
              sourceName: result.sourceRoutine.name,
              replicatedId: result.replicatedRoutine?.id,
              targetFacilityId: result.targetFacilityId,
              targetFacilityName: targetFacilities.find(
                (f) => f.id === result.targetFacilityId,
              )?.name,
            })),
          },
        }
      },
      {
        timeout: 30000,
      },
    )
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

export async function assignRoutineToUsers(
  routineId: string,
  userIds: string[],
  facilityId: string,
) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      const routine = await tx.routine.findUnique({
        where: { id: routineId },
        select: { id: true, name: true },
      })

      if (!routine) {
        return {
          success: false,
          message: "No se encontró la rutina especificada",
        }
      }

      const existingUserRoutines = await tx.userRoutine.findMany({
        where: {
          userId: { in: userIds },
          isActive: true,
        },
        include: {
          routine: {
            select: { name: true },
          },
        },
      })

      const userRoutinesMap = existingUserRoutines.reduce(
        (acc, ur) => {
          if (!acc[ur.userId]) {
            acc[ur.userId] = []
          }
          acc[ur.userId].push(ur)
          return acc
        },
        {} as Record<string, typeof existingUserRoutines>,
      )

      const usersWithOtherRoutines = existingUserRoutines
        .filter((ur) => ur.routineId !== routineId)
        .map((ur) => ({
          userId: ur.userId,
          routineId: ur.routineId,
          routineName: ur.routine.name,
        }))

      if (usersWithOtherRoutines.length > 0) {
        const routineIdsToUnassign = [
          ...new Set(usersWithOtherRoutines.map((u) => u.routineId)),
        ]
        const userIdsToUnassign = [
          ...new Set(usersWithOtherRoutines.map((u) => u.userId)),
        ]

        await tx.userRoutine.deleteMany({
          where: {
            userId: { in: userIdsToUnassign },
            routineId: { in: routineIdsToUnassign },
          },
        })

        const unassignedUsers = await tx.user.findMany({
          where: { id: { in: userIdsToUnassign } },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            email: true,
          },
        })

        for (const routineIdToUnassign of routineIdsToUnassign) {
          const routineName =
            usersWithOtherRoutines.find(
              (u) => u.routineId === routineIdToUnassign,
            )?.routineName || "Desconocida"
          const usersForThisRoutine = usersWithOtherRoutines.filter(
            (u) => u.routineId === routineIdToUnassign,
          )

          await createRoutineTransaction({
            tx,
            type: TransactionType.UNASSIGN_ROUTINE_USER,
            routineId: routineIdToUnassign,
            performedById: user.id,
            facilityId,
            details: {
              action: "Rutina desasignada de usuarios (reemplazo automático)",
              attachmentId: routineIdToUnassign,
              attachmentName: routineName,
              unassignedUsers: unassignedUsers.filter((u) =>
                usersForThisRoutine.some((usr) => usr.userId === u.id),
              ),
              unassignedCount: usersForThisRoutine.length,
              replacedByRoutineId: routineId,
              replacedByRoutineName: routine.name,
            },
          })

          await createNotification({
            tx,
            issuerId: user.id,
            facilityId,
            type: NotificationType.UNASSIGN_ROUTINE_USER,
            relatedId: routineIdToUnassign,
          })
        }
      }

      const existingAssignments = existingUserRoutines
        .filter((ur) => ur.routineId === routineId)
        .map((ur) => ur.userId)

      const newUserIds = userIds.filter(
        (id) => !existingAssignments.includes(id),
      )

      if (newUserIds.length > 0) {
        await tx.userRoutine.createMany({
          data: newUserIds.map((userId) => ({
            userId,
            routineId,
            isActive: true,
          })),
          skipDuplicates: true,
        })
      }

      const users = await tx.user.findMany({
        where: { id: { in: newUserIds } },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          email: true,
        },
      })

      await createRoutineTransaction({
        tx,
        type: TransactionType.ASSIGN_ROUTINE_USER,
        routineId,
        performedById: user.id,
        facilityId,
        details: {
          action: "Rutina asignada a usuarios",
          attachmentId: routineId,
          attachmentName: routine.name,
          assignedUsers: users.map((u) => ({
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            avatarUrl: u.avatarUrl,
            email: u.email,
          })),
          assignedCount: newUserIds.length,
          alreadyAssignedCount: existingAssignments.length,
          replacedRoutinesCount: usersWithOtherRoutines.length,
        },
      })

      await createNotification({
        tx,
        issuerId: user.id,
        facilityId,
        type: NotificationType.ASSIGN_ROUTINE_USER,
        relatedId: routineId,
      })

      revalidatePath("/entrenamiento/rutinas")

      let message = `Rutina asignada a ${newUserIds.length} usuarios correctamente`

      if (existingAssignments.length > 0) {
        message += ` (${existingAssignments.length} ya estaban asignados)`
      }

      if (usersWithOtherRoutines.length > 0) {
        message += `. Se reemplazaron ${usersWithOtherRoutines.length} asignaciones previas`
      }

      return {
        success: true,
        message,
        assignedCount: newUserIds.length,
        alreadyAssignedCount: existingAssignments.length,
        replacedRoutinesCount: usersWithOtherRoutines.length,
      }
    } catch (error) {
      console.error("Error assigning routine to users:", error)
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al asignar la rutina a los usuarios",
      }
    }
  })
}

export async function unassignRoutineFromUsers(
  routineId: string,
  userIds: string[],
  facilityId: string,
) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      const routine = await tx.routine.findUnique({
        where: { id: routineId },
        select: { id: true, name: true },
      })

      if (!routine) {
        return {
          success: false,
          message: "No se encontró la rutina especificada",
        }
      }

      const existingAssignments = await tx.userRoutine.findMany({
        where: {
          routineId,
          userId: { in: userIds },
        },
        select: { userId: true },
      })

      const existingUserIds = existingAssignments.map((a) => a.userId)

      if (existingUserIds.length === 0) {
        return {
          success: false,
          message: "No hay usuarios asignados a esta rutina para desasignar",
        }
      }

      const { count } = await tx.userRoutine.deleteMany({
        where: {
          routineId,
          userId: { in: existingUserIds },
        },
      })

      const users = await tx.user.findMany({
        where: { id: { in: existingUserIds } },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          email: true,
        },
      })

      await createRoutineTransaction({
        tx,
        type: TransactionType.UNASSIGN_ROUTINE_USER,
        routineId,
        performedById: user.id,
        facilityId,
        details: {
          action: "Rutina desasignada de usuarios",
          attachmentId: routineId,
          attachmentName: routine.name,
          unassignedUsers: users.map((u) => ({
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            avatarUrl: u.avatarUrl,
            email: u.email,
          })),
          unassignedCount: count,
        },
      })

      await createNotification({
        tx,
        issuerId: user.id,
        facilityId,
        type: NotificationType.UNASSIGN_ROUTINE_USER,
        relatedId: routineId,
      })

      revalidatePath("/entrenamiento/rutinas")

      return {
        success: true,
        message: `Rutina desasignada de ${count} ${count === 1 ? "usuario" : "usuarios"} correctamente`,
        unassignedCount: count,
      }
    } catch (error) {
      console.error("Error unassigning routine from users:", error)
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al desasignar la rutina de los usuarios",
      }
    }
  })
}

export async function convertToPresetRoutine(
  routineId: string,
  facilityId: string,
) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      const sourceRoutine = await tx.routine.findUnique({
        where: { id: routineId },
        include: {
          dailyExercises: {
            include: {
              exercises: true,
            },
          },
        },
      })

      if (!sourceRoutine) {
        return {
          success: false,
          message: "No se encontró la rutina especificada",
        }
      }

      const presetRoutine = await tx.presetRoutine.create({
        data: {
          name: `${sourceRoutine.name} (Preestablecida)`,
          description: sourceRoutine.description,
          facilityId: sourceRoutine.facilityId,
        },
      })

      for (const dailyExercise of sourceRoutine.dailyExercises) {
        const newDailyExercise = await tx.dailyExercise.create({
          data: {
            dayOfWeek: dailyExercise.dayOfWeek,
            presetRoutineId: presetRoutine.id,
          },
        })

        if (dailyExercise.exercises.length > 0) {
          await tx.exercise.createMany({
            data: dailyExercise.exercises.map((exercise) => ({
              name: exercise.name,
              bodyZone: exercise.bodyZone,
              series: exercise.series,
              count: exercise.count,
              measure: exercise.measure,
              rest: exercise.rest,
              description: exercise.description,
              photoUrl: exercise.photoUrl,
              dailyExerciseId: newDailyExercise.id,
            })),
          })
        }
      }

      const transactionDetails = {
        action: "Rutina convertida a preestablecida",
        attachmentId: routineId,
        attachmentName: sourceRoutine.name,
        presetRoutineId: presetRoutine.id,
        presetRoutineName: presetRoutine.name,
        exercisesCount: sourceRoutine.dailyExercises.reduce(
          (count, de) => count + de.exercises.length,
          0,
        ),
        timestamp: new Date().toISOString(),
      }

      await createRoutineTransaction({
        tx,
        type: TransactionType.ROUTINE_CONVERTED_TO_PRESET,
        routineId: routineId,
        performedById: user.id,
        facilityId: facilityId,
        details: transactionDetails,
      })

      /* await createNotification({
        tx,
        issuerId: user.id,
        facilityId: facilityId,
        type: NotificationType.ROUTINE_CONVERTED_TO_PRESET,
        relatedId: presetRoutine.id,
      }) */

      console.log("test")

      revalidatePath("/entrenamiento/rutinas")
      revalidatePath("/entrenamiento/rutinas-preestablecidas")

      return {
        success: true,
        message: `Rutina "${sourceRoutine.name}" convertida a preestablecida correctamente`,
        sourceRoutineId: routineId,
        presetRoutineId: presetRoutine.id,
      }
    } catch (error) {
      console.error("Error converting routine to preset:", error)
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al convertir la rutina a preestablecida",
      }
    }
  })
}
