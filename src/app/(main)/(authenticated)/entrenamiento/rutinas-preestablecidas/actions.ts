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
import { createPresetRoutineTransaction } from "@/lib/transactionHelpers"

type PresetRoutineResult = {
  success: boolean
  presetRoutine?: RoutineData | null
  error?: string
}

export const getPresetRoutineById = cache(
  async (id: string): Promise<RoutineValues & { id: string }> => {
    try {
      const presetRoutine = await prisma.presetRoutine.findUnique({
        where: { id },
        include: {
          dailyExercises: {
            include: {
              exercises: true,
            },
          },
        },
      })

      if (!presetRoutine) {
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

      presetRoutine.dailyExercises.forEach((dailyExercise) => {
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
        id: presetRoutine.id,
        name: presetRoutine.name,
        description: presetRoutine.description || "",
        facilityId: presetRoutine.facilityId,
        dailyExercises,
      }
    } catch (error) {
      console.error("Error fetching preset routine:", error)
      throw new Error("Failed to fetch preset routine")
    }
  },
)

export async function createPresetRoutine(
  values: RoutineValues,
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
        },
      })

      const daysOfWeek = Object.keys(values.dailyExercises) as DayOfWeek[]

      for (const day of daysOfWeek) {
        const exercises = values.dailyExercises[day]

        if (exercises.length > 0) {
          const dailyExercise = await tx.dailyExercise.create({
            data: {
              dayOfWeek: day,
              presetRoutineId: presetRoutine.id,
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

      const presetRoutineData = await tx.presetRoutine.findUnique({
        where: { id: presetRoutine.id },
        include: {
          dailyExercises: {
            include: {
              exercises: true,
            },
          },
        },
      })

      /* await createPresetRoutineTransaction({
        tx,
        type: TransactionType.PRESET_ROUTINE_CREATED,
        presetRoutineId: presetRoutine.id,
        performedById: user.id,
        facilityId: presetRoutine.facilityId,
        details: {
          action: "Rutina preestablecida creada",
          attachmentId: presetRoutine.id,
          attachmentName: presetRoutine.name,
        },
      }) 

      await createNotification({
        tx,
        issuerId: user.id,
        facilityId: values.facilityId,
        type: NotificationType.PRESET_ROUTINE_CREATED,
        relatedId: presetRoutine.id,
      })
        */

      revalidatePath(`/entrenamiento/rutinas-preestablecidas`)
      return { success: true, presetRoutine: presetRoutineData }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        error: "Error al crear la rutina preestablecida",
      }
    }
  })
}

export async function updatePresetRoutine(
  id: string,
  values: RoutineValues,
): Promise<PresetRoutineResult> {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma.$transaction(async (tx) => {
    try {
      await tx.presetRoutine.update({
        where: { id },
        data: {
          name: values.name,
          description: values.description,
          facilityId: values.facilityId,
        },
      })

      const existingDailyExercises = await tx.dailyExercise.findMany({
        where: { presetRoutineId: id },
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
                presetRoutineId: id,
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

      const presetRoutineData = await tx.presetRoutine.findUnique({
        where: { id },
        include: {
          dailyExercises: {
            include: {
              exercises: true,
            },
          },
        },
      })

      /* await createPresetRoutineTransaction({
        tx,
        type: TransactionType.PRESET_ROUTINE_UPDATED,
        presetRoutineId: id,
        performedById: user.id,
        facilityId: values.facilityId,
        details: {
          action: "Rutina preestablecida actualizada",
          attachmentId: id,
          attachmentName: values.name,
        },
      }) 

      await createNotification({
        tx,
        issuerId: user.id,
        facilityId: values.facilityId,
        type: NotificationType.PRESET_ROUTINE_UPDATED,
        relatedId: id,
      })*/

      revalidatePath(`/entrenamiento/rutinas-preestablecidas`)
      return { success: true, presetRoutine: presetRoutineData }
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

          /* for (const presetRoutine of presetRoutines) {
            await createPresetRoutineTransaction({
              tx,
              type: TransactionType.PRESET_ROUTINE_DELETED,
              presetRoutineId: presetRoutine.id,
              performedById: user.id,
              facilityId,
              details: {
                action: "Rutina preestablecida borrada",
                attachmentId: presetRoutine.id,
                attachmentName: presetRoutine.name,
              },
            })
          }

          await createNotification({
            tx,
            issuerId: user.id,
            facilityId,
            type: NotificationType.PRESET_ROUTINE_DELETED,
          })*/

          const { count } = await tx.presetRoutine.deleteMany({
            where: {
              id: { in: presetRoutineIds },
            },
          }) 

          revalidatePath("/entrenamiento/rutinas-preestablecidas")

          return {
            success: true,
            message: `Se ${count === 1 ? "ha" : "han"} eliminado ${count} ${
              count === 1 ? "rutina preestablecida" : "rutinas preestablecidas"
            }`,
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

type ReplicationResult = {
  sourcePresetRoutine: RoutineData
  replicatedPresetRoutine: RoutineData | null
  targetFacilityId: string
}

export async function replicatePresetRoutines(
  presetRoutineIds: string[],
  targetFacilityIds: string[],
) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Usuario no autenticado")

  return await prisma
    .$transaction(
      async (tx) => {
        const presetRoutines = await tx.presetRoutine.findMany({
          where: {
            id: { in: presetRoutineIds },
          },
          include: {
            dailyExercises: {
              include: {
                exercises: true,
              },
            },
          },
        })

        if (presetRoutines.length === 0) {
          return {
            success: false,
            message: "No se encontraron rutinas preestablecidas para replicar",
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
          for (const sourcePresetRoutine of presetRoutines) {
            try {
              const {
                id: sourceId,
                facilityId: sourceFacilityId,
                dailyExercises,
                ...presetRoutineData
              } = sourcePresetRoutine

              const replicatedPresetRoutine = await tx.presetRoutine.create({
                data: {
                  ...presetRoutineData,
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
                    presetRoutineId: replicatedPresetRoutine.id,
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

              const completeReplicatedPresetRoutine =
                await tx.presetRoutine.findUnique({
                  where: { id: replicatedPresetRoutine.id },
                  include: {
                    dailyExercises: {
                      include: {
                        exercises: true,
                      },
                    },
                  },
                })

              const transactionDetails = {
                action: "Rutina preestablecida replicada",
                sourceId: sourceId,
                sourceName: sourcePresetRoutine.name,
                sourceFacilityId: sourceFacilityId,
                targetFacilityId: targetFacility.id,
                targetFacilityName: targetFacility.name,
                replicatedId: replicatedPresetRoutine.id,
                replicatedName: replicatedPresetRoutine.name,
                exercisesCount: dailyExercises.reduce(
                  (count, de) => count + de.exercises.length,
                  0,
                ),
                timestamp: new Date().toISOString(),
              }

              /* await createPresetRoutineTransaction({
                tx,
                type: TransactionType.PRESET_ROUTINE_REPLICATED,
                presetRoutineId: sourceId,
                performedById: user.id,
                facilityId: sourceFacilityId,
                details: transactionDetails,
              }) */

              replicationResults.push({
                sourcePresetRoutine,
                replicatedPresetRoutine: completeReplicatedPresetRoutine,
                targetFacilityId: targetFacility.id,
              })
            } catch (error) {
              console.error(
                `Error replicating preset routine ${sourcePresetRoutine.id} to facility ${targetFacility.id}:`,
                error,
              )
              throw error
            }
          }
        }

        /* await Promise.all(
          targetFacilityIds.map((facilityId) => {
            const relatedPresetRoutineId = replicationResults.find(
              (r) => r.targetFacilityId === facilityId,
            )?.replicatedPresetRoutine?.id

            return createNotification({
              tx,
              issuerId: user.id,
              facilityId,
              type: NotificationType.PRESET_ROUTINE_REPLICATED,
              relatedId: relatedPresetRoutineId,
            })
          }),
        ) */

        revalidatePath(`/entrenamiento/rutinas-preestablecidas`)
        return {
          success: true,
          message: `Se han replicado ${replicationResults.length} rutinas preestablecidas en ${targetFacilities.length} establecimientos.`,
          replicatedCount: replicationResults.length,
          details: {
            replicatedRoutines: replicationResults.map((result) => ({
              sourceId: result.sourcePresetRoutine.id,
              sourceName: result.sourcePresetRoutine.name,
              replicatedId: result.replicatedPresetRoutine?.id,
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
      console.error("Error replicating preset routines:", error)
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al replicar las rutinas preestablecidas",
      }
    })
}
