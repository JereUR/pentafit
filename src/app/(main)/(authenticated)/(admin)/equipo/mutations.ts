"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { useToast } from "@/hooks/use-toast"
import { MemberValues, UpdateMemberValues } from "@/lib/validation"
import { createMember, deleteMembers, updateMember } from "./actions"
import { useUploadThing } from "@/lib/uploadthing"

export function useCreateMemberMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { startUpload } = useUploadThing("imageUploader")
  const router = useRouter()

  return useMutation({
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: MemberValues
      avatar?: File
    }) => {
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
      queryClient.invalidateQueries({
        queryKey: ["clientsWithPlans", newMember?.facilities.map((f) => f.facilityId)],
      })
      queryClient.invalidateQueries({
        queryKey: ["clients", newMember?.facilities.map((f) => f.facilityId)],
      })
      queryClient.invalidateQueries({
        queryKey: [
          "latestTransactions",
          newMember?.facilities.map((f) => f.facilityId),
        ],
      })
      queryClient.invalidateQueries({
        queryKey: ["metrics", newMember?.facilities.map((f) => f.facilityId)],
      })

      router.push(`/equipo`)
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
  const router = useRouter()

  return useMutation({
    mutationFn: async ({
      id,
      values,
      avatar,
    }: {
      id: string
      values: UpdateMemberValues
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
        console.error("Update error:", result.error, "Details:", result.details)
        throw new Error(result.error)
      }

      if (!result.member) {
        throw new Error("No member data returned from update operation")
      }

      return result.member
    },
    onSuccess: (updatedMember) => {
      toast({
        title: "Integrante actualizado correctamente",
      })
      queryClient.invalidateQueries({
        queryKey: ["team", updatedMember.facilities.map((f) => f.facilityId)],
      })
      queryClient.invalidateQueries({
        queryKey: ["clientsWithPlans", updatedMember?.facilities.map((f) => f.facilityId)],
      })
      queryClient.invalidateQueries({
        queryKey: ["clients", updatedMember?.facilities.map((f) => f.facilityId)],
      })
      queryClient.invalidateQueries({
        queryKey: [
          "latestTransactions",
          updatedMember?.facilities.map((f) => f.facilityId),
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [
          "metrics",
          updatedMember.facilities.map((f) => f.facilityId),
        ],
      })
      router.push(`/equipo`)
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error)
      toast({
        variant: "destructive",
        title: "Error al actualizar el integrante",
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
      const result = await deleteMembers(idsArray, facilityId)
      if (!result.success) {
        throw new Error(result.message)
      }
      return { ...result, facilityId }
    },
    onSuccess: (data) => {
      const { message, deletedCount, facilityId } = data

      const title =
        deletedCount === undefined
          ? "Operación completada"
          : deletedCount === 1
            ? "Integrante eliminado correctamente"
            : "Integrantes eliminados correctamente"

      toast({
        title,
        description: message,
      })
      queryClient.invalidateQueries({
        queryKey: ["team", facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["clientsWithPlans", facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["clients", facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["latestTransactions", facilityId],
      })
      queryClient.invalidateQueries({
        queryKey: ["metrics", facilityId],
      })
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error)
      toast({
        variant: "destructive",
        title: "Error al eliminar al integrante",
        description: error.message,
      })
    },
  })
}
