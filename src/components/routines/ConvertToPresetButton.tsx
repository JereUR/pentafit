import { Copy } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import LoadingButton from "../LoadingButton"
import { useConvertToPresetRoutineMutation } from "@/app/(main)/(authenticated)/entrenamiento/rutinas/mutations"

interface ConvertToPresetButtonProps {
  routineId: string
  facilityId: string
}

export function ConvertToPresetButton({ routineId, facilityId }: ConvertToPresetButtonProps) {
  const { toast } = useToast()
  const { mutate: convertToPreset, isPending: isConverting } = useConvertToPresetRoutineMutation()

  const handleConvert = (e: React.MouseEvent) => {
    e.stopPropagation()

    convertToPreset(
      { routineId, facilityId },
      {
        onError: (error: Error) => {
          toast({
            variant: "destructive",
            title: "Error al convertir a preestablecida",
            description: error.message,
          })
        },
      },
    )
  }

  return (
    <LoadingButton loading={isConverting} variant="outline" className="w-auto" onClick={handleConvert} >
      <Copy className="h-3 w-3 mr-1" /> Preestablecer
    </LoadingButton>
  )
}

