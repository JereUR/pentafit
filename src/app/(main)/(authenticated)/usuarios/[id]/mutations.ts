import { useUploadThing } from "@/lib/uploadthing"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateUserProfile } from "./actions"
import { useRouter } from "next/navigation"

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
    onSuccess: () => {
      toast({
        title: "Perfil actualizado correctamente",
      })
      queryClient.invalidateQueries({ queryKey: ["user"] })
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
