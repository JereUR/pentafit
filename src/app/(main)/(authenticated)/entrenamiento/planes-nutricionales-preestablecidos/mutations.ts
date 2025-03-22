"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { useToast } from "@/hooks/use-toast"
import { NutritionalPlanValues } from "@/lib/validation"
import {
  createPresetNutritionalPlan,
  deletePresetNutritionalPlans,
  replicatePresetNutritionalPlans,
  updatePresetNutritionalPlan,
} from "./actions"

export function useCreatePresetNutritionalPlanMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (values: NutritionalPlanValues) => {
      const result = await createPresetNutritionalPlan(values)
      if (!result.success || result.error) {
        throw new Error(
          result.error ||
            "Error desconocido al crear el plan nutricional predefinido",
        )
      }
      return result.presetNutritionalPlan
    },
    onSuccess: (newPresetNutritionalPlan) => {
      toast({
        title: "Plan nutricional predefinido creado correctamente",
      })
      queryClient.invalidateQueries({
        queryKey: [
          "presetNutritionalPlans",
          newPresetNutritionalPlan?.facilityId,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: ["latestTransactions", newPresetNutritionalPlan?.facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["metrics", newPresetNutritionalPlan?.facilityId],
      })
      router.push("/entrenamiento/planes-nutricionales-predefinidos")
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al crear el plan nutricional predefinido",
        description: error.message,
      })
    },
  })
}

export function useUpdatePresetNutritionalPlanMutation() {
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
      const result = await updatePresetNutritionalPlan(id, values)
      if (!result.success || result.error) {
        throw new Error(
          result.error ||
            "Error desconocido al editar el plan nutricional predefinido",
        )
      }
      return result.presetNutritionalPlan
    },
    onSuccess: (updatedPresetNutritionalPlan) => {
      toast({
        title: "Plan nutricional predefinido actualizado correctamente",
      })
      queryClient.invalidateQueries({
        queryKey: [
          "presetNutritionalPlans",
          updatedPresetNutritionalPlan?.facilityId,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [
          "latestTransactions",
          updatedPresetNutritionalPlan?.facilityId,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: ["metrics", updatedPresetNutritionalPlan?.facilityId],
      })
      router.push("/entrenamiento/planes-nutricionales-predefinidos")
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al actualizar el plan nutricional predefinido",
        description: error.message,
      })
    },
  })
}

export function useDeletePresetNutritionalPlanMutation() {
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
      const result = await deletePresetNutritionalPlans(idsArray, facilityId)
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
          ? "Error al eliminar planes nutricionales predefinidos"
          : deletedCount === 1
            ? "Plan nutricional predefinido eliminado correctamente"
            : "Planes nutricionales predefinidos eliminados correctamente"

      toast({
        title,
        description,
      })
      queryClient.invalidateQueries({
        queryKey: ["presetNutritionalPlans", facilityId],
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
        title: "Error al eliminar el plan nutricional predefinido",
        description: error.message,
      })
    },
  })
}

export function useReplicatePresetNutritionalPlanMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      presetNutritionalPlanIds,
      targetFacilityIds,
    }: {
      presetNutritionalPlanIds: string[]
      targetFacilityIds: string[]
    }) => {
      const result = await replicatePresetNutritionalPlans(
        presetNutritionalPlanIds,
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
        title: "Planes nutricionales predefinidos replicados correctamente",
        description: result.message,
      })

      if (result.targetFacilityIds && Array.isArray(result.targetFacilityIds)) {
        result.targetFacilityIds.forEach((facilityId) => {
          queryClient.invalidateQueries({
            queryKey: ["presetNutritionalPlans", facilityId],
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
        title: "Error al replicar los planes nutricionales predefinidos",
        description: error.message,
      })
    },
  })
}
