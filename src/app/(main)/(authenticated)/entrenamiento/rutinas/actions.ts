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
                targetFacilityName: targetFacility.name,
                replicatedId: replicatedRoutine.id,
                replicatedName: replicatedRoutine.name,
                exercisesCount: dailyExercises.reduce(
                  (count, de) => count + de.exercises.length,
                  0,
                ),
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
