"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useToast } from "@/hooks/use-toast"
import { MemberValues } from "@/lib/validation"
import { createMember, deleteMember, updateMember } from "./actions"
import { useUploadThing } from "@/lib/uploadthing"

export function useCreateMemberMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { startUpload } = useUploadThing("imageUploader")

  return useMutation({
    mutationFn: async (values: MemberValues, avatar?: File) => {
      if (avatar) {
        const uploadResult = await startUpload([avatar])
        if (uploadResult && uploadResult[0]) {
          values = { ...values, avatarUrl: uploadResult[0].url }
        }
      }

      const result = await createMember(values)
      if (result.error) {
        throw new Error(result.error)
      }

      return result.member
    },
    onSuccess: (newMember) => {
      toast({
        title: "Integrante agregado correctamente",
      })
      queryClient.invalidateQueries({
        queryKey: ["team", newMember?.facilities.map((f) => f.facilityId)],
      })
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al agregar integrante",
        description: error.message,
      })
    },
  })
}

export function useUpdateMemberMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { startUpload } = useUploadThing("imageUploader")

  return useMutation({
    mutationFn: async ({
      id,
      values,
      avatar,
    }: {
      id: string
      values: MemberValues
      avatar?: File
    }) => {
      if (avatar) {
        const uploadResult = await startUpload([avatar])
        if (uploadResult && uploadResult[0]) {
          values = { ...values, avatarUrl: uploadResult[0].url }
        }
      }

      const result = await updateMember(id, values)
      if (result.error) {
        throw new Error(result.error)
      }

      return result.member
    },
    onSuccess: (newMember) => {
      toast({
        title: "Actividad actualizada correctamente",
      })
      queryClient.invalidateQueries({
        queryKey: ["team", newMember?.facilities.map((f) => f.facilityId)],
      })
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al actualizar la actividad",
        description: error.message,
      })
    },
  })
}

export function useDeleteMemberMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      memberIds,
      facilityId,
    }: {
      memberIds: string | string[]
      facilityId: string
    }) => {
      const idsArray = Array.isArray(memberIds) ? memberIds : [memberIds]
      const result = await deleteMember(idsArray)
      if (!result.success) {
        throw new Error(result.message)
      }

      const { message, deletedCount } = result

      return { message, deletedCount, facilityId }
    },
    onSuccess: (message) => {
      const { message: description, deletedCount, facilityId } = message

      const title =
        deletedCount === undefined
          ? "Error al eliminar integrantes"
          : deletedCount === 1
            ? "Integrante eliminado correctamente"
            : "Integrantes eliminados correctamente"

      toast({
        title,
        description,
      })
      queryClient.invalidateQueries({
        queryKey: ["team", facilityId],
      })
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al eliminar al integrante",
        description: error.message,
      })
    },
  })
}

/* export function useReplicateActivityMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      activityIds,
      targetFacilityIds,
    }: {
      activityIds: string[]
      targetFacilityIds: string[]
    }) => {
      const result = await replicateActivities(activityIds, targetFacilityIds)
      if (!result.success) {
        throw new Error(result.message)
      }
      return result
    },
    onSuccess: (result) => {
      toast({
        title: "Actividades replicadas correctamente",
        description: result.message,
      })
      queryClient.invalidateQueries({
        queryKey: ["activities"],
      })
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al replicar las actividades",
        description: error.message,
      })
    },
  })
} */
