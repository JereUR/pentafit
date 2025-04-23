"use client"

import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import type { CompleteAllExercisesParams, CompleteExerciseParams, ExerciseCompletionResult } from "@/types/progress"
import { completeAllExercises, completeExercise } from "./actions"
import type { DayOfWeek } from "@prisma/client"

export function useCompleteExerciseMutation() {
  const { toast } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation<ExerciseCompletionResult, Error, CompleteExerciseParams & { dayOfWeek: DayOfWeek }>({
    mutationFn: async (params) => {
      const result = await completeExercise(params)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: (result, variables) => {
      toast({
        title: "Ejercicio registrado",
        description: "El ejercicio ha sido marcado como completado",
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

      queryClient.invalidateQueries({ queryKey: ["exerciseCompletions"] })
      queryClient.invalidateQueries({
        queryKey: ["todayRoutine", variables.facilityId],
      })
      router.refresh()
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al registrar el ejercicio",
        description: error.message,
      })
    },
  })
}

export function useCompleteAllExercisesMutation() {
  const { toast } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation<ExerciseCompletionResult, Error, CompleteAllExercisesParams & { dayOfWeek: DayOfWeek }>({
    mutationFn: async (params) => {
      const result = await completeAllExercises(params)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: (result, variables) => {
      toast({
        title: variables.completed ? "Ejercicios completados" : "Ejercicios desmarcados",
        description: variables.completed
          ? "Todos los ejercicios han sido marcados como completados"
          : "Todos los ejercicios han sido desmarcados",
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

      queryClient.invalidateQueries({ queryKey: ["exerciseCompletions"] })
      queryClient.invalidateQueries({
        queryKey: ["todayRoutine", variables.facilityId],
      })
      router.refresh()
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al actualizar los ejercicios",
        description: error.message,
      })
    },
  })
}
