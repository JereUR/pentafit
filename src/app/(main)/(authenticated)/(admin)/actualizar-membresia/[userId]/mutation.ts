import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

import { MembershipUpdateValues } from "@/lib/validation"
import { updateMembership } from "./actions"

export function useMembershipUpdateMutation() {
  const { toast } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: MembershipUpdateValues) => {
      return await updateMembership(values)
    },
    onSuccess: (data) => {
      toast({
        title: "Membresía actualizada correctamente",
      })
      queryClient.invalidateQueries({ queryKey: ["user", data.id] })
      router.push(`/usuarios/${data.id}`)
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al actualizar la membresía",
        description: error.message,
      })
    },
  })
}
