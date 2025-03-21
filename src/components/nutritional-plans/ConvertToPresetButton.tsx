"use client"

import type React from "react"

import { Copy } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import LoadingButton from "../LoadingButton"
import { useConvertToPresetNutritionalPlanMutation } from "@/app/(main)/(authenticated)/entrenamiento/planes-nutricionales/mutations"

interface ConvertToPresetButtonProps {
  nutritionalPlanId: string
  facilityId: string
}

export function ConvertToPresetButton({ nutritionalPlanId, facilityId }: ConvertToPresetButtonProps) {
  const { toast } = useToast()
  const { mutate: convertToPreset, isPending: isConverting } = useConvertToPresetNutritionalPlanMutation()

  const handleConvert = (e: React.MouseEvent) => {
    e.stopPropagation()

    convertToPreset(
      { nutritionalPlanId, facilityId },
      {
        onError: (error: Error) => {
          toast({
            variant: "destructive",
            title: "Error al convertir a preestablecido",
            description: error.message,
          })
        },
      },
    )
  }

  return (
    <LoadingButton loading={isConverting} variant="outline" className="w-auto" onClick={handleConvert}>
      <Copy className="h-3 w-3 mr-1" /> Preestablecer
    </LoadingButton>
  )
}

