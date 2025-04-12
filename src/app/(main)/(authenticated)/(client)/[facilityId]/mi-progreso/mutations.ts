"use client"

import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { completeExercise, recordMeasurement } from "./actions"

export function useCompleteExerciseMutation() {
  const { toast } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({
      exerciseId,
      routineId,
      facilityId,
      completed,
      series,
      reps,
      weight,
      duration,
      notes,
    }: {
      exerciseId: string
      routineId: string
      facilityId: string
      completed: boolean
      series?: number
      reps?: number
      weight?: number
      duration?: number
      notes?: string
    }) => {
      const result = await completeExercise({
        exerciseId,
        routineId,
        facilityId,
        completed,
        series,
        reps,
        weight,
        duration,
        notes,
      })
      return result
    },
    onSuccess: () => {
      toast({
        title: "Ejercicio registrado",
        description: "El ejercicio ha sido marcado como completado",
      })
      queryClient.invalidateQueries({ queryKey: ["userProgress"] })
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

  return mutation
}

export function useRecordMeasurementMutation() {
  const { toast } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({
      facilityId,
      weight,
      height,
      bodyFat,
      muscle,
      chest,
      waist,
      hips,
      arms,
      thighs,
      notes,
    }: {
      facilityId: string
      weight?: number
      height?: number
      bodyFat?: number
      muscle?: number
      chest?: number
      waist?: number
      hips?: number
      arms?: number
      thighs?: number
      notes?: string
    }) => {
      const result = await recordMeasurement({
        facilityId,
        weight,
        height,
        bodyFat,
        muscle,
        chest,
        waist,
        hips,
        arms,
        thighs,
        notes,
      })
      return result
    },
    onSuccess: () => {
      toast({
        title: "Medidas registradas",
        description: "Tus medidas han sido registradas correctamente",
      })
      queryClient.invalidateQueries({ queryKey: ["userProgress"] })
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

  return mutation
}
