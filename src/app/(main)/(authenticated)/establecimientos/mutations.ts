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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facilities"] })
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
        description: `Se ha eliminado ${data.deletedFacility?.name || 'el establecimiento'}`,
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
