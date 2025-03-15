"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { useToast } from "@/hooks/use-toast"
import {
  createPresetRoutine,
  updatePresetRoutine,
  deletePresetRoutines,
  replicatePresetRoutines,
} from "./actions"
import { RoutineValues } from "@/lib/validation"

export function useCreatePresetRoutineMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (values: RoutineValues) => {
      const result = await createPresetRoutine(values)
      if (!result.success || result.error) {
        throw new Error(
          result.error || "Error desconocido al crear la rutina preestablecida",
        )
      }
      return result.presetRoutine
    },
    onSuccess: (newPresetRoutine) => {
      toast({
        title: "Rutina preestablecida creada correctamente",
      })
      queryClient.invalidateQueries({
        queryKey: ["preset-routines", newPresetRoutine?.facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["latestTransactions", newPresetRoutine?.facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["metrics", newPresetRoutine?.facilityId],
      })
      router.push("/entrenamiento/rutinas-preestablecidas")
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al crear la rutina preestablecida",
        description: error.message,
      })
    },
  })
}

export function useUpdatePresetRoutineMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string
      values: RoutineValues
    }) => {
      const result = await updatePresetRoutine(id, values)
      if (!result.success || result.error) {
        throw new Error(
          result.error ||
            "Error desconocido al editar la rutina preestablecida",
        )
      }
      return result.presetRoutine
    },
    onSuccess: (updatedPresetRoutine) => {
      toast({
        title: "Rutina preestablecida actualizada correctamente",
      })
      queryClient.invalidateQueries({
        queryKey: ["preset-routines", updatedPresetRoutine?.facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["latestTransactions", updatedPresetRoutine?.facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["metrics", updatedPresetRoutine?.facilityId],
      })
      router.push("/entrenamiento/rutinas-preestablecidas")
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al actualizar la rutina preestablecida",
        description: error.message,
      })
    },
  })
}

export function useDeletePresetRoutineMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      routineIds,
      facilityId,
    }: {
      routineIds: string | string[]
      facilityId: string
    }) => {
      const idsArray = Array.isArray(routineIds) ? routineIds : [routineIds]
      const result = await deletePresetRoutines(idsArray, facilityId)
      if (!result.success) {
        throw new Error(result.message)
      }

      return {
        success: result.success,
        message: result.message,
        deletedCount: result.deletedCount,
        facilityId,
      }
    },
    onSuccess: (data) => {
      const { message: description, deletedCount, facilityId } = data

      const title =
        deletedCount === undefined
          ? "Error al eliminar rutinas preestablecidas"
          : deletedCount === 1
            ? "Rutina preestablecida eliminada correctamente"
            : "Rutinas preestablecidas eliminadas correctamente"

      toast({
        title,
        description,
      })
      queryClient.invalidateQueries({
        queryKey: ["preset-routines", facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["latestTransactions", facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["metrics", facilityId],
      })
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al eliminar la rutina preestablecida",
        description: error.message,
      })
    },
  })
}

export function useReplicatePresetRoutineMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      presetRoutineIds,
      targetFacilityIds,
    }: {
      presetRoutineIds: string[]
      targetFacilityIds: string[]
    }) => {
      const result = await replicatePresetRoutines(
        presetRoutineIds,
        targetFacilityIds,
      )
      if (!result.success) {
        throw new Error(result.message)
      }
      return {
        ...result,
        targetFacilityIds,
      }
    },
    onSuccess: (result) => {
      toast({
        title: "Rutinas preestablecidas replicadas correctamente",
        description: result.message,
      })

      if (result.targetFacilityIds && Array.isArray(result.targetFacilityIds)) {
        result.targetFacilityIds.forEach((facilityId) => {
          queryClient.invalidateQueries({
            queryKey: ["preset-routines", facilityId],
          })

          queryClient.invalidateQueries({
            queryKey: ["latestTransactions", facilityId],
          })

          queryClient.invalidateQueries({
            queryKey: ["metrics", facilityId],
          })
        })
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al replicar las rutinas preestablecidas",
        description: error.message,
      })
    },
  })
}
