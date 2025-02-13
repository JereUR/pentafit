"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { useToast } from "@/hooks/use-toast"
import type { PlanValues } from "@/lib/validation"
import { deletePlans, replicatePlans } from "./actions"

export function useCreatePlanMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (planData: PlanValues) => {
      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error("Validation errors:", errorData.errors)
        throw new Error(errorData.message || "Error al crear el plan")
      }

      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] })
    },
  })
}

export function useUpdatePlanMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: PlanValues }) => {
      const response = await fetch(`/api/plans`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...values }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al actualizar el plan")
      }

      return response.json()
    },
    onSuccess: (result) => {
      if (result.success && result.plan) {
        toast({
          title: `Plan '${result.plan.name}' actualizado correctamente`,
        })
        queryClient.invalidateQueries({
          queryKey: ["plans"],
        })
        router.push("/planes")
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
