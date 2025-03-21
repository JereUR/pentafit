"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { useToast } from "@/hooks/use-toast"
import { ActivityValues } from "@/lib/validation"
import {
  createActivity,
  deleteActivities,
  updateActivity,
  replicateActivities,
} from "./actions"

export function useCreateActivityMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (values: ActivityValues) => {
      const result = await createActivity(values)
      if (!result.success || result.error) {
        throw new Error(
          result.error || "Error desconocido al crear la actividad",
        )
      }
      return result.activity
    },
    onSuccess: (newActivity) => {
      toast({
        title: "Actividad creada correctamente",
      })
      queryClient.invalidateQueries({
        queryKey: ["activities", newActivity?.facilityId],
      })

      queryClient.invalidateQueries({
        queryKey: ["latestTransactions", newActivity?.facilityId],
      })

      queryClient.invalidateQueries({
        queryKey: ["metrics", newActivity?.facilityId],
      })

      router.push("/actividades")
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al crear la actividad",
        description: error.message,
      })
    },
  })
}

export function useUpdateActivityMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string
      values: ActivityValues
    }) => {
      const result = await updateActivity(id, values)
      if (!result.success || result.error) {
        throw new Error(
          result.error || "Error desconocido al editar la actividad",
        )
      }
      return result.activity
    },
    onSuccess: (updatedActivity) => {
      toast({
        title: "Actividad actualizada correctamente",
      })
      queryClient.invalidateQueries({
        queryKey: ["activities", updatedActivity?.facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["latestTransactions", updatedActivity?.facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["metrics", updatedActivity?.facilityId],
      })
      router.push("/actividades")
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al actualizar la actividad",
        description: error.message,
      })
    },
  })
}

export function useDeleteActivityMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      activityIds,
      facilityId,
    }: {
      activityIds: string | string[]
      facilityId: string
    }) => {
      const idsArray = Array.isArray(activityIds) ? activityIds : [activityIds]
      const result = await deleteActivities(idsArray, facilityId)
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
          ? "Error al eliminar actividades"
          : deletedCount === 1
            ? "Actividad eliminada correctamente"
            : "Actividades eliminadas correctamente"

      toast({
        title,
        description,
      })
      queryClient.invalidateQueries({
        queryKey: ["activities", facilityId],
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
        title: "Error al eliminar la actividad",
        description: error.message,
      })
    },
  })
}

export function useReplicateActivityMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      activityIds,
      targetFacilityIds,
    }: {
      activityIds: string[]
      targetFacilityIds: string[]
    }) => {
      const result = await replicateActivities(activityIds, targetFacilityIds)
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
        title: "Actividades replicadas correctamente",
        description: result.message,
      })

      if (result.targetFacilityIds && Array.isArray(result.targetFacilityIds)) {
        result.targetFacilityIds.forEach((facilityId) => {
          queryClient.invalidateQueries({
            queryKey: ["activities", facilityId],
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
        title: "Error al replicar las actividades",
        description: error.message,
      })
    },
  })
}
