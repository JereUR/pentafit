import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { updateUserProfile } from "./actions"

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

  const mutation = useMutation({
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: UpdateUserProfileValues
      avatar?: File
    }) => {
      const updatedUser = await updateUserProfile({
        ...values,
        avatarUrl: avatar ? URL.createObjectURL(avatar) : undefined,
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
