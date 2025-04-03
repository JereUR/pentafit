"use client"

import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { subscribeToDiary, unsubscribeFromDiary } from "./actions"
import { useRouter } from "next/navigation"

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
