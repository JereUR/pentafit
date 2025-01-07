import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useUploadThing } from "@/lib/uploadthing"
import { UpdateUserProfileValues } from "@/lib/validation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateUserProfile } from "./actions"
import { UserData } from "@/types/user"

export function useUpdateProfileMutation() {
  const { toast } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { startUpload: startAvatarUpload } = useUploadThing("userAvatar")

  const mutation = useMutation({
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: UpdateUserProfileValues
      avatar?: File
    }) => {
      return Promise.all([
        updateUserProfile(values),
        avatar && startAvatarUpload([avatar]),
      ])
    },
    onSuccess: async ([updatedUser, uploadResult]) => {
      const newAvatarUrl = uploadResult?.[0].serverData.avatarUrl

      queryClient.setQueryData<UserData[]>(["users"], (oldUsers) => {
        if (!Array.isArray(oldUsers)) return oldUsers

        return oldUsers.map((user) =>
          user.id === updatedUser.id
            ? {
                ...user,
                ...updatedUser,
                avatarUrl: newAvatarUrl || user.avatarUrl,
              }
            : user,
        )
      })

      toast({
        title: "Perfil actualizado",
        description: "Tu perfil se ha actualizado correctamente.",
      })

      router.refresh()
    },
    onError: (error) => {
      toast({
        title: "Error al actualizar",
        description: "Hubo un problema al intentar actualizar tu perfil.",
        variant: "destructive",
      })
      console.error(error)
    },
  })

  return mutation
}
