"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useToast } from "@/hooks/use-toast"
import type { PlanValues } from "@/lib/validation"
import { createPlan, deletePlans, updatePlan, replicatePlans } from "./actions"

export function useCreatePlanMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPlan,
    onSuccess: (result) => {
      if (result.success && result.plan) {
        toast({
          title: `Plan ${result.plan.name} creado correctamente`,
        })
        queryClient.invalidateQueries({
          queryKey: ["plans"],
        })
      } else {
        throw new Error(result.error || "Error desconocido al crear el plan")
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al crear el plan",
        description: error.message,
      })
    },
  })
}

export function useUpdatePlanMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: PlanValues }) =>
      updatePlan(id, values),
    onSuccess: (result) => {
      if (result.success && result.plan) {
        toast({
          title: `Plan '${result.plan.name}' actualizado correctamente`,
        })
        queryClient.invalidateQueries({
          queryKey: ["plans"],
        })
      } else {
        throw new Error(
          result.error || "Error desconocido al actualizar el plan",
        )
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al actualizar el plan",
        description: error.message,
      })
    },
  })
}

export function useDeletePlanMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      plansIds,
      facilityId,
    }: {
      plansIds: string | string[]
      facilityId: string
    }) => {
      const idsArray = Array.isArray(plansIds) ? plansIds : [plansIds]
      const result = await deletePlans(idsArray)
      if (!result.success) {
        throw new Error(result.message)
      }

      const { message, deletedCount } = result

      return { message, deletedCount, facilityId }
    },
    onSuccess: (message) => {
      const { message: description, deletedCount, facilityId } = message

      const title =
        deletedCount === undefined
          ? "Error al eliminar planes"
          : deletedCount === 1
            ? "Plan eliminada correctamente"
            : "Planes eliminadas correctamente"

      toast({
        title,
        description,
      })
      queryClient.invalidateQueries({
        queryKey: ["plans", facilityId],
      })
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al eliminar el plan",
        description: error.message,
      })
    },
  })
}

export function useReplicatePlanMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      plansIds,
      targetFacilityIds,
    }: {
      plansIds: string[]
      targetFacilityIds: string[]
    }) => {
      const result = await replicatePlans(plansIds, targetFacilityIds)
      if (!result.success) {
        throw new Error(result.message)
      }
      return result
    },
    onSuccess: (result) => {
      toast({
        title: "Planes replicados correctamente",
        description: result.message,
      })
      queryClient.invalidateQueries({
        queryKey: ["plans"],
      })
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al replicar los planes",
        description: error.message,
      })
    },
  })
}
