"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { useToast } from "@/hooks/use-toast"
import type { DiaryValues } from "@/lib/validation"
import {
  createDiary,
  deleteDiaries,
  updateDiary,
  replicateDiaries,
} from "./actions"

export function useCreateDiaryMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (values: DiaryValues | null) => {
      if (!values) {
        throw new Error("No se proporcionaron datos para crear la agenda")
      }
      const result = await createDiary(values)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: (result) => {
      if (result.success && result.diary) {
        toast({
          title: `Agenda ${result.diary.name} creada correctamente`,
        })
        queryClient.invalidateQueries({
          queryKey: ["diaries", result.diary.facilityId],
        })
        queryClient.invalidateQueries({
          queryKey: ["latestTransactions", result.diary.facilityId],
        })
  
        queryClient.invalidateQueries({
          queryKey: ["metrics", result.diary.facilityId],
        })

      }
      router.push("/agenda")
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al crear la agenda",
        description: error.message,
      })
    },
  })
}

export function useUpdateDiaryMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: DiaryValues }) =>
      updateDiary(id, values),
    onSuccess: (result) => {
      if (result.success && result.diary) {
        toast({
          title: `Agenda '${result.diary.name}' actualizada correctamente`,
        })
        
        queryClient.invalidateQueries({
          queryKey: ["diaries", result.diary.facilityId],
        })
        queryClient.invalidateQueries({
          queryKey: ["latestTransactions", result.diary.facilityId],
        })
  
        queryClient.invalidateQueries({
          queryKey: ["metrics", result.diary.facilityId],
        })
        router.push("/agenda")
      } else {
        throw new Error(
          result.error || "Error desconocido al actualizar la agenda",
        )
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al actualizar la agenda",
        description: error.message,
      })
    },
  })
}

export function useDeleteDiaryMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      diaryIds,
      facilityId,
    }: {
      diaryIds: string | string[]
      facilityId: string
    }) => {
      const idsArray = Array.isArray(diaryIds) ? diaryIds : [diaryIds]
      const result = await deleteDiaries(idsArray, facilityId)

      if (!result.success) {
        throw new Error(result.message)
      }

      return { ...result, facilityId }
    },
    onSuccess: (data) => {
      const { message, deletedCount, facilityId } = data

      toast({
        title: deletedCount === 1 ? "Agenda eliminada" : "Agendas eliminadas",
        description: message,
      })

      queryClient.invalidateQueries({
        queryKey: ["diaries", facilityId],
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
        title: "Error al eliminar la agenda",
        description: error.message,
      })
    },
  })
}

export function useReplicateDiaryMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      diaryIds,
      targetFacilityIds,
    }: {
      diaryIds: string[]
      targetFacilityIds: string[]
    }) => {
      const result = await replicateDiaries(diaryIds, targetFacilityIds)
      if (!result.success) {
        throw new Error(result.message)
      }
      return {...result,targetFacilityIds}
    },
    onSuccess: (result) => {
      toast({
        title: "Agendas replicadas correctamente",
        description: result.message,
      })
      
      if (result.targetFacilityIds && Array.isArray(result.targetFacilityIds)) {
        result.targetFacilityIds.forEach((facilityId) => {
          queryClient.invalidateQueries({
            queryKey: ["diaries", facilityId],
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
        title: "Error al replicar las agendas",
        description: error.message,
      })
    },
  })
}
