"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useToast } from "@/hooks/use-toast"
import { PlanValues } from "@/lib/validation"
import { createPlan, deletePlans, updatePlan, replicatePlans } from "./actions"

export function useCreatePlanMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: PlanValues) => {
      const result = await createPlan(values)
      if (result.error) {
        throw new Error(result.error)
      }
      return result.plan
    },
    onSuccess: (newPlan) => {
      toast({
        title: `Plan ${newPlan?.name} creado correctamente`,
      })
      queryClient.invalidateQueries({
        queryKey: ["plans"],
      })
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
    mutationFn: async ({ id, values }: { id: string; values: PlanValues }) => {
      const result = await updatePlan(id, values)
      if (result.error) {
        throw new Error(result.error)
      }
      return result.plan
    },
    onSuccess: (updatedPlan) => {
      toast({
        title: `Plan '${updatedPlan?.name}' actualizado correctamente`,
      })
      queryClient.invalidateQueries({
        queryKey: ["plans"],
      })
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
    mutationFn: async (planIds: string | string[]) => {
      const idsArray = Array.isArray(planIds) ? planIds : [planIds]
      const result = await deletePlans(idsArray)
      if (!result.success) {
        throw new Error(result.message)
      }

      const { message, deletedCount } = result

      return { message, deletedCount }
    },
    onSuccess: (message) => {
      const { message: description, deletedCount } = message

      const title =
        deletedCount === undefined
          ? "Error al eliminar planes"
          : deletedCount === 1
            ? "Plan eliminado correctamente"
            : "Planes eliminados correctamente"

      toast({
        title,
        description,
      })
      queryClient.invalidateQueries({
        queryKey: ["plans"],
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
      planIds,
      targetFacilityIds,
    }: {
      planIds: string[]
      targetFacilityIds: string[]
    }) => {
      const result = await replicatePlans(planIds, targetFacilityIds)
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
