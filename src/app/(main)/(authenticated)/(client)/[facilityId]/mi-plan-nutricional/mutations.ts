"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { useToast } from "@/hooks/use-toast"
import { completeAllMeals, completeFoodItem, completeMeal } from "./actions"
import type { DayOfWeek } from "@prisma/client"

export function useCompleteFoodItemMutation() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const router = useRouter()

  return useMutation({
    mutationFn: async ({
      foodItemId,
      mealId,
      nutritionalPlanId,
      facilityId,
      completed,
      dayOfWeek,
    }: {
      foodItemId: string
      mealId: string
      nutritionalPlanId: string
      facilityId: string
      completed: boolean
      dayOfWeek: DayOfWeek
    }) => {
      const result = await completeFoodItem({
        foodItemId,
        mealId,
        nutritionalPlanId,
        facilityId,
        completed,
        dayOfWeek,
      })
      
      if (!result.success) {
        throw new Error(result.error)
      }
      
      return result
    },
    onSuccess: (data, variables) => {
      toast({
        title: variables.completed ? "Alimento completado" : "Alimento desmarcado",
        description: variables.completed 
          ? "El alimento ha sido marcado como completado" 
          : "El alimento ha sido desmarcado",
      })
      
      queryClient.invalidateQueries({
        queryKey: ["todayNutrition", variables.facilityId],
      })
      
      if (data.userId) {
        queryClient.invalidateQueries({
          queryKey: ["userProgress", data.userId, variables.facilityId],
        })
      }
      
      router.refresh()
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error al actualizar el alimento",
        description: error instanceof Error ? error.message : "Error al actualizar el alimento",
      })
    },
  })
}

export function useCompleteMealMutation() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const router = useRouter()

  return useMutation({
    mutationFn: async ({
      mealId,
      nutritionalPlanId,
      facilityId,
      completed,
      dayOfWeek,
    }: {
      mealId: string
      nutritionalPlanId: string
      facilityId: string
      completed: boolean
      dayOfWeek: DayOfWeek
    }) => {
      const result = await completeMeal({
        mealId,
        nutritionalPlanId,
        facilityId,
        completed,
        dayOfWeek,
      })
      
      if (!result.success) {
        throw new Error(result.error)
      }
      
      return result
    },
    onSuccess: (data, variables) => {
      toast({
        title: variables.completed ? "Comida completada" : "Comida desmarcada",
        description: variables.completed 
          ? "La comida ha sido marcada como completada" 
          : "La comida ha sido desmarcada",
      })
      
      queryClient.invalidateQueries({
        queryKey: ["todayNutrition", variables.facilityId],
      })
      
      if (data.userId) {
        queryClient.invalidateQueries({
          queryKey: ["userProgress", data.userId, variables.facilityId],
        })
      }
      
      router.refresh()
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error al actualizar la comida",
        description: error instanceof Error ? error.message : "Error al actualizar la comida",
      })
    },
  })
}

export function useCompleteAllMealsMutation() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const router = useRouter()

  return useMutation({
    mutationFn: async ({
      mealIds,
      nutritionalPlanId,
      facilityId,
      completed,
      dayOfWeek,
    }: {
      mealIds: string[]
      nutritionalPlanId: string
      facilityId: string
      completed: boolean
      dayOfWeek: DayOfWeek
    }) => {
      const result = await completeAllMeals({
        mealIds,
        nutritionalPlanId,
        facilityId,
        completed,
        dayOfWeek,
      })
      
      if (!result.success) {
        throw new Error(result.error)
      }
      
      return result
    },
    onSuccess: (data, variables) => {
      toast({
        title: variables.completed ? "Comidas completadas" : "Comidas desmarcadas",
        description: variables.completed 
          ? "Todas las comidas han sido marcadas como completadas" 
          : "Todas las comidas han sido desmarcadas",
      })
      
      queryClient.invalidateQueries({
        queryKey: ["todayNutrition", variables.facilityId],
      })
      
      if (data.userId) {
        queryClient.invalidateQueries({
          queryKey: ["userProgress", data.userId, variables.facilityId],
        })
      }
      
      router.refresh()
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error al actualizar las comidas",
        description: error instanceof Error ? error.message : "Error al actualizar las comidas",
      })
    },
  })
}
