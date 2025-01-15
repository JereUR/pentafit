import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { useUploadThing } from "@/lib/uploadthing"
import { useToast } from "@/hooks/use-toast"
import { FacilityValues } from "@/lib/validation"
import { createFacility, deleteFacility, updateFacility } from "./actions"

export function useFacilityMutation(userId: string) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { startUpload } = useUploadThing("facilityImageUploader")
  const router = useRouter()

  return useMutation({
    mutationFn: async ({
      values,
      logo,
      webLogo,
    }: {
      values: FacilityValues
      logo?: File
      webLogo?: File
    }) => {
      let logoUrl: string | undefined
      let logoWebUrl: string | undefined

      if (logo) {
        const uploadResult = await startUpload([logo])
        if (uploadResult && uploadResult[0]) {
          logoUrl = uploadResult[0].url
        }
      }

      if (webLogo) {
        const uploadResult = await startUpload([webLogo])
        if (uploadResult && uploadResult[0]) {
          logoWebUrl = uploadResult[0].url
        }
      }

      const updatedFacility = await createFacility(userId, {
        ...values,
        logoUrl,
        metadata: {
          ...values.metadata,
          logoWebUrl,
        },
      })
      return updatedFacility
    },
    onSuccess: () => {
      toast({
        title: "Establecimiento creado correctamente",
      })
      queryClient.invalidateQueries({ queryKey: ["facilities"] })
      router.push("/establecimientos")
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al crear el establecimiento",
        description: error.message,
      })
    },
  })
}

export function useUpdateFacilityMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string
      values: FacilityValues
      logo?: File
      webLogo?: File
    }) => updateFacility(id, values),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["facilities"] })
      queryClient.invalidateQueries({
        queryKey: ["facilityDetails", data.facility?.id],
      })
    },
  })
}

export function useDeleteFacilityMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteFacility(id)
      if (result.error) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: (data) => {
      toast({
        title: "Establecimiento eliminado correctamente",
        description: `Se ha eliminado ${data.deletedFacility?.name || "el establecimiento"}`,
      })
      queryClient.invalidateQueries({ queryKey: ["facilities"] })
      router.push("/establecimientos")
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al eliminar el establecimiento",
        description: error.message,
      })
    },
  })
}

export function useToggleFacilityActivationMutation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await fetch(`/api/facility/${id}/toggle-activation`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive }),
      })
      if (!response.ok) {
        throw new Error("Failed to toggle facility activation")
      }
      return response.json()
    },
    onSuccess: (data) => {
      toast({
        title: `Establecimiento ${data.isActive ? "activado" : "desactivado"} correctamente`,
        description: `${data.name} ha sido ${data.isActive ? "activado" : "desactivado"}.`,
      })
      queryClient.invalidateQueries({ queryKey: ["facilities"] })
      queryClient.invalidateQueries({
        queryKey: ["facilityDetails", data.id],
      })
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al cambiar el estado del establecimiento",
        description: error.message,
      })
    },
  })
}
