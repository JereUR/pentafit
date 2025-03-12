"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { useToast } from "@/hooks/use-toast"
import {
  createRoutine,
  updateRoutine,
  deleteRoutines,
  replicateRoutines,
} from "./actions"
import { RoutineValues } from "@/lib/validation"

export function useCreateRoutineMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (values: RoutineValues) => {
      const result = await createRoutine(values)
      if (!result.success || result.error) {
        throw new Error(result.error || "Error desconocido al crear la rutina")
      }
      return result.routine
    },
    onSuccess: (newRoutine) => {
      toast({
        title: "Rutina creada correctamente",
      })
      queryClient.invalidateQueries({
        queryKey: ["routines", newRoutine?.facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["latestTransactions", newRoutine?.facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["metrics", newRoutine?.facilityId],
      })
      router.push("/entrenamiento/rutinas")
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al crear la rutina",
        description: error.message,
      })
    },
  })
}

export function useUpdateRoutineMutation() {
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
      const result = await updateRoutine(id, values)
      if (!result.success || result.error) {
        throw new Error(result.error || "Error desconocido al editar la rutina")
      }
      return result.routine
    },
    onSuccess: (updatedRoutine) => {
      toast({
        title: "Rutina actualizada correctamente",
      })
      queryClient.invalidateQueries({
        queryKey: ["routines", updatedRoutine?.facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["latestTransactions", updatedRoutine?.facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["metrics", updatedRoutine?.facilityId],
      })
      router.push("/entrenamiento/rutinas")
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al actualizar la rutina",
        description: error.message,
      })
    },
  })
}

export function useDeleteRoutineMutation() {
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
      const result = await deleteRoutines(idsArray, facilityId)
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
          ? "Error al eliminar rutinas"
          : deletedCount === 1
            ? "Rutina eliminada correctamente"
            : "Rutinas eliminadas correctamente"

      toast({
        title,
        description,
      })
      queryClient.invalidateQueries({
        queryKey: ["routines", facilityId],
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
        title: "Error al eliminar la rutina",
        description: error.message,
      })
    },
  })
}

export function useReplicateRoutineMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      routineIds,
      targetFacilityIds,
    }: {
      routineIds: string[]
      targetFacilityIds: string[]
    }) => {
      const result = await replicateRoutines(routineIds, targetFacilityIds)
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
        title: "Rutinas replicadas correctamente",
        description: result.message,
      })

      if (result.targetFacilityIds && Array.isArray(result.targetFacilityIds)) {
        result.targetFacilityIds.forEach((facilityId) => {
          queryClient.invalidateQueries({
            queryKey: ["routines", facilityId],
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
        title: "Error al replicar las rutinas",
        description: error.message,
      })
    },
  })
}
