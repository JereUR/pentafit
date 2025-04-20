import { useUploadThing } from "@/lib/uploadthing"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateUserHealthInfo, updateUserProfile } from "./actions"
import { useRouter } from "next/navigation"
import { healthInfoSchema, HealthInfoValues } from "@/lib/validation"

export interface UpdateUserProfileValues {
  firstName: string
  lastName: string
  birthday: string
  gender: "Masculino" | "Femenino" | "Otros"
}

export function useUpdateProfileMutation() {
  const { toast } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { startUpload } = useUploadThing("imageUploader")

  const mutation = useMutation({
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: UpdateUserProfileValues
      avatar?: File
    }) => {
      let avatarUrl: string | undefined

      if (avatar) {
        const uploadResult = await startUpload([avatar])
        if (uploadResult && uploadResult[0]) {
          avatarUrl = uploadResult[0].url
        }
      }

      const updatedUser = await updateUserProfile({
        ...values,
        avatarUrl,
      })
      return updatedUser
    },
    onSuccess: (data) => {
      toast({
        title: "Perfil actualizado correctamente",
      })
      queryClient.invalidateQueries({ queryKey: ["user", data.id] })
      router.refresh()
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al actualizar el perfil",
        description: error.message,
      })
    },
  })

  return mutation
}

export function useUpdateHealthInfoMutation() {
  const { toast } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (values: HealthInfoValues) => {
      const validatedData = healthInfoSchema.parse(values)
      const updatedHealthInfo = await updateUserHealthInfo(validatedData)
      return updatedHealthInfo
    },
    onSuccess: (data) => {
      toast({
        title: "Información médica actualizada correctamente",
      })
      queryClient.invalidateQueries({ queryKey: ["user", data.userId] })
      router.refresh()
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al actualizar la información médica",
        description: error.message,
      })
    },
  })

  return mutation
}
