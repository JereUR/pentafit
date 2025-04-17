"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { completeAllMeals, completeFoodItem, completeMeal } from "./actions"

export function useCompleteFoodItemMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      foodItemId,
      mealId,
      nutritionalPlanId,
      facilityId,
      completed,
    }: {
      foodItemId: string
      mealId: string
      nutritionalPlanId: string
      facilityId: string
      completed: boolean
    }) => {
      const result = await completeFoodItem({
        foodItemId,
        mealId,
        nutritionalPlanId,
        facilityId,
        completed,
      })
      return result
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["todayNutrition", variables.facilityId],
      })
      if (data.success && data.userId) {
        queryClient.invalidateQueries({
          queryKey: ["userProgress", data.userId, variables.facilityId],
        })
      }
    },
    onError: (error) => {
      console.error("Error completing food item:", error)
    },
  })
}

export function useCompleteMealMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      mealId,
      nutritionalPlanId,
      facilityId,
      completed,
    }: {
      mealId: string
      nutritionalPlanId: string
      facilityId: string
      completed: boolean
    }) => {
      const result = await completeMeal({
        mealId,
        nutritionalPlanId,
        facilityId,
        completed,
      })
      return result
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["todayNutrition", variables.facilityId],
      })
      if (data.success && data.userId) {
        queryClient.invalidateQueries({
          queryKey: ["userProgress", data.userId, variables.facilityId],
        })
      }
    },
    onError: (error) => {
      console.error("Error completing meal:", error)
    },
  })
}

export function useCompleteAllMealsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      mealIds,
      nutritionalPlanId,
      facilityId,
      completed,
    }: {
      mealIds: string[]
      nutritionalPlanId: string
      facilityId: string
      completed: boolean
    }) => {
      const result = await completeAllMeals({
        mealIds,
        nutritionalPlanId,
        facilityId,
        completed,
      })
      return result
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["todayNutrition", variables.facilityId],
      })
      if (data.success && data.userId) {
        queryClient.invalidateQueries({
          queryKey: ["userProgress", data.userId, variables.facilityId],
        })
      }
    },
    onError: (error) => {
      console.error("Error completing all meals:", error)
    },
  })
}
