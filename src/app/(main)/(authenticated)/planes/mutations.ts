"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { useToast } from "@/hooks/use-toast"
import type { PlanValues } from "@/lib/validation"
import { createPlan, deletePlans, replicatePlans, updatePlan } from "./actions"

export function useCreatePlanMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (planData: PlanValues) => {
      const result = await createPlan(planData)

      if (!result.success) {
        throw new Error(result.error || "Error al crear el plan")
      }

      return result
    },
    onSuccess: () => {
      toast({
        title: "Plan creado correctamente",
      })
      queryClient.invalidateQueries({ queryKey: ["plans"] })
      router.push("/planes")
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
  const router = useRouter()

  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: PlanValues }) => {
      const result = await updatePlan(id, values)

      if (!result.success) {
        throw new Error(result.error || "Error al actualizar el plan")
      }

      return result
    },
    onSuccess: () => {
      toast({
        title: "Plan actualizado correctamente",
      })
      queryClient.invalidateQueries({ queryKey: ["plans"] })
      router.push("/planes")
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
      const result = await deletePlans(idsArray, facilityId)

      if (!result.success) {
        throw new Error(result.message)
      }

      return { ...result, facilityId }
    },
    onSuccess: (data) => {
      const { message, deletedCount, facilityId } = data

      toast({
        title: deletedCount === 1 ? "Plan eliminado" : "Planes eliminados",
        description: message,
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
