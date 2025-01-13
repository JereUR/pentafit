import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useUploadThing } from "@/lib/uploadthing"
import { useToast } from "@/hooks/use-toast"
import { FacilityValues } from "@/lib/validation"
import { createFacility } from "./actions"

export function useFacilityMutation(userId: string) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { startUpload } = useUploadThing("facilityImageUploader")

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
