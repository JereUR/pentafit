"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { useToast } from "@/hooks/use-toast"
import {
  createRoutine,
  updateRoutine,
  deleteRoutines,
  createPresetRoutine,
  updatePresetRoutine,
  deletePresetRoutines,
  createUserRoutine,
  createRoutineFromPreset,
  replicateRoutines,
} from "./actions"
import {
  PresetRoutineValues,
  RoutineValues,
  UserRoutineValues,
} from "@/lib/validation"

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

export function useCreatePresetRoutineMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (values: PresetRoutineValues) => {
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
        queryKey: ["presetRoutines", newPresetRoutine?.facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["latestTransactions", newPresetRoutine?.facilityId],
      })
      router.push("/entrenamiento/rutinas/preestablecidas")
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
      values: PresetRoutineValues
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
        queryKey: ["presetRoutines", updatedPresetRoutine?.facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["latestTransactions", updatedPresetRoutine?.facilityId],
      })
      router.push("/entrenamiento/rutinas/preestablecidas")
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
      presetRoutineIds,
      facilityId,
    }: {
      presetRoutineIds: string | string[]
      facilityId: string
    }) => {
      const idsArray = Array.isArray(presetRoutineIds)
        ? presetRoutineIds
        : [presetRoutineIds]
      const result = await deletePresetRoutines(idsArray, facilityId)
      if (!result.success) {
        throw new Error(result.message)
      }

      return {
        message: result.message,
        deletedCount: result.deletedCount,
        facilityId,
      }
    },
    onSuccess: (message) => {
      const { message: description, deletedCount, facilityId } = message

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
        queryKey: ["presetRoutines", facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["latestTransactions", facilityId],
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

export function useCreateUserRoutineMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: UserRoutineValues) => {
      const result = await createUserRoutine(values)
      if (!result.success || result.error) {
        throw new Error(
          result.error || "Error desconocido al asignar la rutina al usuario",
        )
      }
      return result.userRoutine
    },
    onSuccess: (userRoutine) => {
      toast({
        title: "Rutina asignada correctamente",
      })
      queryClient.invalidateQueries({
        queryKey: ["userRoutines", userRoutine?.userId],
      })
      queryClient.invalidateQueries({
        queryKey: ["latestTransactions"],
      })
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al asignar la rutina al usuario",
        description: error.message,
      })
    },
  })
}

export function useCreateRoutineFromPresetMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async ({
      presetRoutineId,
      facilityId,
    }: {
      presetRoutineId: string
      facilityId: string
    }) => {
      const result = await createRoutineFromPreset(presetRoutineId, facilityId)
      if (!result.success || result.error) {
        throw new Error(
          result.error ||
            "Error desconocido al crear la rutina desde la preestablecida",
        )
      }
      return result.routine
    },
    onSuccess: (newRoutine) => {
      toast({
        title: "Rutina creada desde preestablecida correctamente",
      })
      queryClient.invalidateQueries({
        queryKey: ["routines", newRoutine?.facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["latestTransactions", newRoutine?.facilityId],
      })
      router.push("/entrenamiento/rutinas")
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al crear la rutina desde la preestablecida",
        description: error.message,
      })
    },
  })
}
