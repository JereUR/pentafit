"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import {
  CompleteAllMealsParams,
  CompleteMealParams,
  MealCompletionResult,
} from "@/types/nutritionaPlansClient"
import { completeAllMeals, completeMeal } from "./actions"

export function useCompleteMealMutation() {
  const { toast } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation<MealCompletionResult, Error, CompleteMealParams>({
    mutationFn: async (params) => {
      const result = await completeMeal(params)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: (result, variables) => {
      toast({
        title: variables.completed ? "Comida registrada" : "Comida desmarcada",
        description: variables.completed
          ? "La comida ha sido marcada como completada"
          : "La comida ha sido desmarcada",
      })

      if (result.userId) {
        queryClient.invalidateQueries({
          queryKey: ["userProgress", result.userId, variables.facilityId],
        })
      } else {
        queryClient.invalidateQueries({
          queryKey: ["userProgress"],
        })
      }

      queryClient.invalidateQueries({
        queryKey: ["todayNutrition", variables.facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["userNutritionalPlan", variables.facilityId],
      })
      router.refresh()
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al registrar la comida",
        description: error.message,
      })
    },
  })
}

export function useCompleteAllMealsMutation() {
  const { toast } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation<MealCompletionResult, Error, CompleteAllMealsParams>({
    mutationFn: async (params) => {
      const result = await completeAllMeals(params)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: (result, variables) => {
      toast({
        title: variables.completed
          ? "Comidas completadas"
          : "Comidas desmarcadas",
        description: variables.completed
          ? "Todas las comidas han sido marcadas como completadas"
          : "Todas las comidas han sido desmarcadas",
      })

      if (result.userId) {
        queryClient.invalidateQueries({
          queryKey: ["userProgress", result.userId, variables.facilityId],
        })
      } else {
        queryClient.invalidateQueries({
          queryKey: ["userProgress"],
        })
      }

      queryClient.invalidateQueries({
        queryKey: ["todayNutrition", variables.facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["userNutritionalPlan", variables.facilityId],
      })
      router.refresh()
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al registrar las comidas",
        description: error.message,
      })
    },
  })
}
