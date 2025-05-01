"use client"

import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { recordDiaryAttendance, subscribeToDiary, unsubscribeFromDiary } from "./actions"
import { useRouter } from "next/navigation"
import { DiaryAttendanceParams } from "@/types/diaryClient"

export function useSubscribeToDiaryMutation() {
  const { toast } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({
      diaryId,
      facilityId,
      selectedDayIds,
    }: {
      diaryId: string
      facilityId: string
      selectedDayIds?: string[]
    }) => {
      const result = await subscribeToDiary({
        diaryId,
        facilityId,
        selectedDayIds,
      })
      return result
    },
    onSuccess: () => {
      toast({
        title: "Inscripción exitosa",
        description: "Te has inscrito correctamente a la actividad",
      })
      queryClient.invalidateQueries({ queryKey: ["diaryPlans"] })
      queryClient.invalidateQueries({ queryKey: ["userDiaries"] })
      queryClient.invalidateQueries({ queryKey: ["todayDiary"] })
      router.refresh()
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al inscribirse",
        description: error.message,
      })
    },
  })

  return mutation
}

export function useUnsubscribeFromDiaryMutation() {
  const { toast } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({
      userDiaryId,
      facilityId,
    }: {
      userDiaryId: string
      facilityId: string
    }) => {
      const result = await unsubscribeFromDiary({ userDiaryId, facilityId })
      return result
    },
    onSuccess: () => {
      toast({
        title: "Suscripción cancelada",
        description: "Has cancelado tu inscripción a esta actividad",
      })
      queryClient.invalidateQueries({ queryKey: ["userDiaries"] })
      queryClient.invalidateQueries({ queryKey: ["diaryPlans"] })
      queryClient.invalidateQueries({ queryKey: ["todayDiary"] })
      router.refresh()
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al cancelar la inscripción",
        description: error.message,
      })
    },
  })

  return mutation
}

export function useDiaryAttendanceMutation() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const router = useRouter()

  return useMutation({
    mutationFn: async (params: DiaryAttendanceParams) => {
      const result = await recordDiaryAttendance(params)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: (result, variables) => {
      toast({
        title: variables.attended ? "Asistencia registrada" : "Inasistencia registrada",
        description: variables.attended 
          ? `La asistencia ha sido registrada correctamente para el día ${variables.dayOfWeek}`
          : `La inasistencia ha sido registrada para el día ${variables.dayOfWeek}`,
      })
      
      queryClient.invalidateQueries({
        queryKey: ["userDiaries", variables.facilityId],
      })
      
      if (result.userId) {
        queryClient.invalidateQueries({
          queryKey: ["userProgress", result.userId, variables.facilityId],
        })
      }
      
      router.refresh()
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error al registrar asistencia",
        description: error instanceof Error ? error.message : "Error al registrar la asistencia",
      })
    },
  })
}
