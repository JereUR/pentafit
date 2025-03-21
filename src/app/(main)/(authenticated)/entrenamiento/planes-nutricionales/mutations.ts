"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { useToast } from "@/hooks/use-toast"
import {
  createNutritionalPlan,
  updateNutritionalPlan,
  deleteNutritionalPlans,
  replicateNutritionalPlans,
  assignNutritionalPlanToUsers,
  unassignNutritionalPlanFromUsers,
  convertToPresetNutritionalPlan,
} from "./actions"
import { NutritionalPlanValues } from "@/lib/validation"

export function useCreateNutritionalPlanMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (values: NutritionalPlanValues) => {
      const result = await createNutritionalPlan(values)
      if (!result.success || result.error) {
        throw new Error(
          result.error || "Error desconocido al crear el plan nutricional",
        )
      }
      return result.nutritionalPlan
    },
    onSuccess: (newNutritionalPlan) => {
      toast({
        title: "Plan nutricional creado correctamente",
      })
      queryClient.invalidateQueries({
        queryKey: ["nutritionalPlans", newNutritionalPlan?.facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["latestTransactions", newNutritionalPlan?.facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["metrics", newNutritionalPlan?.facilityId],
      })
      router.push("/nutricion/planes")
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al crear el plan nutricional",
        description: error.message,
      })
    },
  })
}

export function useUpdateNutritionalPlanMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string
      values: NutritionalPlanValues
    }) => {
      const result = await updateNutritionalPlan(id, values)
      if (!result.success || result.error) {
        throw new Error(
          result.error || "Error desconocido al editar el plan nutricional",
        )
      }
      return result.nutritionalPlan
    },
    onSuccess: (updatedNutritionalPlan) => {
      toast({
        title: "Plan nutricional actualizado correctamente",
      })
      queryClient.invalidateQueries({
        queryKey: ["nutritionalPlans", updatedNutritionalPlan?.facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["latestTransactions", updatedNutritionalPlan?.facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["metrics", updatedNutritionalPlan?.facilityId],
      })
      router.push("/nutricion/planes")
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al actualizar el plan nutricional",
        description: error.message,
      })
    },
  })
}

export function useDeleteNutritionalPlanMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      nutritionalPlanIds,
      facilityId,
    }: {
      nutritionalPlanIds: string | string[]
      facilityId: string
    }) => {
      const idsArray = Array.isArray(nutritionalPlanIds)
        ? nutritionalPlanIds
        : [nutritionalPlanIds]
      const result = await deleteNutritionalPlans(idsArray, facilityId)
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
          ? "Error al eliminar planes nutricionales"
          : deletedCount === 1
            ? "Plan nutricional eliminado correctamente"
            : "Planes nutricionales eliminados correctamente"

      toast({
        title,
        description,
      })
      queryClient.invalidateQueries({
        queryKey: ["nutritionalPlans", facilityId],
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
        title: "Error al eliminar el plan nutricional",
        description: error.message,
      })
    },
  })
}

export function useReplicateNutritionalPlanMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      nutritionalPlanIds,
      targetFacilityIds,
    }: {
      nutritionalPlanIds: string[]
      targetFacilityIds: string[]
    }) => {
      const result = await replicateNutritionalPlans(
        nutritionalPlanIds,
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
        title: "Planes nutricionales replicados correctamente",
        description: result.message,
      })

      if (result.targetFacilityIds && Array.isArray(result.targetFacilityIds)) {
        result.targetFacilityIds.forEach((facilityId) => {
          queryClient.invalidateQueries({
            queryKey: ["nutritionalPlans", facilityId],
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
        title: "Error al replicar los planes nutricionales",
        description: error.message,
      })
    },
  })
}

export function useAssignNutritionalPlanToUsersMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      nutritionalPlanId,
      userIds,
      facilityId,
    }: {
      nutritionalPlanId: string
      userIds: string[]
      facilityId: string
    }) => {
      const result = await assignNutritionalPlanToUsers(
        nutritionalPlanId,
        userIds,
        facilityId,
      )
      if (!result.success) {
        throw new Error(result.message)
      }
      return result
    },
    onSuccess: (result) => {
      toast({
        title: "Plan nutricional asignado correctamente",
        description: result.message,
      })

      queryClient.invalidateQueries({
        queryKey: ["nutritionalPlans"],
      })
      queryClient.invalidateQueries({
        queryKey: ["latestTransactions"],
      })
      queryClient.invalidateQueries({
        queryKey: ["metrics"],
      })
      queryClient.invalidateQueries({
        queryKey: ["assignedNutritionalPlanUsers"],
      })
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al asignar el plan nutricional",
        description: error.message,
      })
    },
  })
}

export function useUnassignNutritionalPlanFromUsersMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      nutritionalPlanId,
      userIds,
      facilityId,
    }: {
      nutritionalPlanId: string
      userIds: string[]
      facilityId: string
    }) => {
      const result = await unassignNutritionalPlanFromUsers(
        nutritionalPlanId,
        userIds,
        facilityId,
      )
      if (!result.success) {
        throw new Error(result.message)
      }
      return result
    },
    onSuccess: (result) => {
      toast({
        title: "Plan nutricional desasignado correctamente",
        description: result.message,
      })

      queryClient.invalidateQueries({
        queryKey: ["nutritionalPlans"],
      })
      queryClient.invalidateQueries({
        queryKey: ["latestTransactions"],
      })
      queryClient.invalidateQueries({
        queryKey: ["metrics"],
      })
      queryClient.invalidateQueries({
        queryKey: ["assignedNutritionalPlanUsers"],
      })
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al desasignar el plan nutricional",
        description: error.message,
      })
    },
  })
}

export function useConvertToPresetNutritionalPlanMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      nutritionalPlanId,
      facilityId,
    }: {
      nutritionalPlanId: string
      facilityId: string
    }) => {
      const result = await convertToPresetNutritionalPlan(
        nutritionalPlanId,
        facilityId,
      )
      if (!result.success) {
        throw new Error(result.message)
      }
      return result
    },
    onSuccess: (result) => {
      toast({
        title: "Plan nutricional convertido a preestablecido correctamente",
        description: result.message,
      })

      queryClient.invalidateQueries({
        queryKey: ["nutritionalPlans"],
      })
      queryClient.invalidateQueries({
        queryKey: ["presetNutritionalPlans"],
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
        title: "Error al convertir el plan nutricional",
        description: error.message,
      })
    },
  })
}
