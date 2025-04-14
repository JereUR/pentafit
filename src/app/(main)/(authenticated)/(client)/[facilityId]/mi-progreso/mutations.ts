"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { useToast } from "@/hooks/use-toast"
import { completeExercise, recordMeasurement } from "./actions"
import { MeasurementFormValues } from "@/lib/validation"
import { ExerciseCompletionResult, MeasurementResult } from "@/types/progress"

type CompleteExerciseParams = {
  exerciseId: string
  routineId: string
  facilityId: string
  completed: boolean
  series?: number
  reps?: number
  weight?: number
  duration?: number
  notes?: string
}

export function useCompleteExerciseMutation() {
  const { toast } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation<ExerciseCompletionResult, Error, CompleteExerciseParams>({
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

export function useRecordMeasurementMutation() {
  const { toast } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation<
    MeasurementResult,
    Error,
    MeasurementFormValues & { facilityId: string }
  >({
    mutationFn: async (values) => {
      const result = await recordMeasurement(values)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: (result, variables) => {
      toast({
        title: "Medidas registradas",
        description: "Tus medidas han sido registradas correctamente",
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

      queryClient.invalidateQueries({ queryKey: ["userMeasurements"] })
      router.refresh()
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al registrar las medidas",
        description: error.message,
      })
    },
  })
}
