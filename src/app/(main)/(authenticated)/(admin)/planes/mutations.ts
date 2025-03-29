"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { useToast } from "@/hooks/use-toast"
import type { PlanValues } from "@/lib/validation"
import {
  assignPlanToUsers,
  createPlan,
  deletePlans,
  replicatePlans,
  unassignPlanFromUsers,
  updatePlan,
} from "./actions"

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

      return result.plan
    },
    onSuccess: (newPlan) => {
      toast({
        title: "Plan creado correctamente",
      })

      queryClient.invalidateQueries({
        queryKey: ["plans", newPlan?.facilityId],
      })

      queryClient.invalidateQueries({
        queryKey: ["latestTransactions", newPlan?.facilityId],
      })

      queryClient.invalidateQueries({
        queryKey: ["metrics", newPlan?.facilityId],
      })

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

      return result.plan
    },
    onSuccess: (updatedPlan) => {
      toast({
        title: "Plan actualizado correctamente",
      })

      queryClient.invalidateQueries({
        queryKey: ["plans", updatedPlan?.facilityId],
      })

      queryClient.invalidateQueries({
        queryKey: ["latestTransactions", updatedPlan?.facilityId],
      })

      queryClient.invalidateQueries({
        queryKey: ["metrics", updatedPlan?.facilityId],
      })

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
      return { ...result, targetFacilityIds }
    },
    onSuccess: (result) => {
      toast({
        title: "Planes replicados correctamente",
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
        title: "Error al replicar los planes",
        description: error.message,
      })
    },
  })
}

export function useAssignPlanToUsersMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      planId,
      userIds,
      facilityId,
    }: {
      planId: string
      userIds: string[]
      facilityId: string
    }) => {
      const result = await assignPlanToUsers(planId, userIds, facilityId)

      if (!result.success) {
        throw new Error(
          result.message || "Error al asignar el plan a los usuarios",
        )
      }

      return result
    },
    onSuccess: (data) => {
      toast({
        title: "Plan asignado correctamente",
        description: data.message,
      })

      queryClient.invalidateQueries({
        queryKey: ["plans"],
      })

      queryClient.invalidateQueries({
        queryKey: ["assignedPlanUsers"],
      })

      queryClient.invalidateQueries({
        queryKey: ["latestTransactions"],
      })

      queryClient.invalidateQueries({
        queryKey: ["metrics"],
      })
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al asignar el plan",
        description: error.message,
      })
    },
  })
}

export function useUnassignPlanFromUsersMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      planId,
      userIds,
      facilityId,
    }: {
      planId: string
      userIds: string[]
      facilityId: string
    }) => {
      const result = await unassignPlanFromUsers(planId, userIds, facilityId)

      if (!result.success) {
        throw new Error(
          result.message || "Error al desasignar el plan de los usuarios",
        )
      }

      return result
    },
    onSuccess: (data) => {
      toast({
        title: "Plan desasignado correctamente",
        description: data.message,
      })

      queryClient.invalidateQueries({
        queryKey: ["plans"],
      })

      queryClient.invalidateQueries({
        queryKey: ["assignedPlanUsers"],
      })

      queryClient.invalidateQueries({
        queryKey: ["latestTransactions"],
      })

      queryClient.invalidateQueries({
        queryKey: ["metrics"],
      })
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al desasignar el plan",
        description: error.message,
      })
    },
  })
}
