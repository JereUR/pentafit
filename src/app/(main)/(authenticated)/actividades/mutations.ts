"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useToast } from "@/hooks/use-toast"
import { ActivityValues } from "@/lib/validation"
import { createActivity, deleteActivity, updateActivity } from "./actions"

export function useCreateActivityMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: ActivityValues) => {
      const result = await createActivity(values)
      if (result.error) {
        throw new Error(result.error)
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

  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string
      values: ActivityValues
    }) => {
      const result = await updateActivity(id, values)
      if (result.error) {
        throw new Error(result.error)
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
    mutationFn: async ({ id }: { id: string }) => {
      const result = await deleteActivity(id)
      if (result.error) {
        throw new Error(result.error)
      }
      return result.deletedActivity
    },
    onSuccess: (deletedActivity) => {
      toast({
        title: "Actividad eliminada correctamente",
        description: `Se ha eliminado ${deletedActivity?.name || "la actividad"}`,
      })
      queryClient.invalidateQueries({
        queryKey: ["activities", deletedActivity?.facilityId],
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
