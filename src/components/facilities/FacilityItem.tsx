"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Trash2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FacilityReduceData } from "@/types/facility"
import noLogoImage from '@/assets/no-image.png'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useDeleteFacilityMutation, useToggleFacilityActivationMutation } from "@/app/(main)/(authenticated)/establecimientos/mutations"
import { useToast } from "@/hooks/use-toast"
import LoadingButton from '../LoadingButton'

interface FacilityItemProps {
  facility: FacilityReduceData
  isWorking: boolean
  onWorkingChange: () => void
  isUpdatingFacility: boolean
}

export function FacilityItem({ facility, isWorking, onWorkingChange, isUpdatingFacility }: FacilityItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { mutate: deleteFacility, isPending: isDeleting } = useDeleteFacilityMutation()
  const { mutate: toggleActivation, isPending: isToggling } = useToggleFacilityActivationMutation()
  const { toast } = useToast()

  const handleDelete = () => {
    deleteFacility(facility.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false)
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error al eliminar el establecimiento",
          description: error.message,
        })
        setIsDeleteDialogOpen(false)
      },
    })
  }

  const handleToggleActivation = () => {
    toggleActivation({ id: facility.id, isActive: !facility.isActive })
  }

  const getActiveStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-500 hover:bg-green-600" : "bg-background hover:bg-background/50"
  }

  const getWorkingStatusColor = (isWorking: boolean) => {
    return isWorking ? "bg-purple-500 hover:bg-purple-600" : "bg-background hover:bg-background/50"
  }

  return (
    <Card className={`mb-4 ${isWorking ? 'border-primary border-2' : ''}`}>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-16 h-16 sm:w-10 sm:h-10">
          <AvatarImage src={facility.logoUrl || (noLogoImage.src as string)} alt={facility.name} />
          <AvatarFallback>{facility.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-xl sm:text-lg">{facility.name}</CardTitle>
          <CardDescription className="mt-1 text-sm">{facility.description}</CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <LoadingButton
            loading={isToggling}
            onClick={handleToggleActivation}
            size="sm"
            className={`rounded-full text-white ${getActiveStatusColor(facility.isActive)} ${!facility.isActive && 'border border-input hover:border-green-600'}`}
          >
            {facility.isActive ? "Activo" : "Inactivo"}
          </LoadingButton>
          <LoadingButton
            loading={isUpdatingFacility}
            onClick={onWorkingChange}
            size="sm"
            className={`rounded-full text-white ${getWorkingStatusColor(facility.isWorking)} ${!facility.isWorking && 'border border-input hover:border-purple-600'}`}
            disabled={!facility.isActive}
          >
            {facility.isWorking ? "Área de trabajo actual" : "Seleccionar como área"}
          </LoadingButton>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-sm text-background-500">
            {isWorking ? "Este establecimiento es el área de trabajo actual" : ""}
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/establecimientos/editar/${facility.id}`}>
                <Edit className="mr-2 h-4 w-4" /> Editar
              </Link>
            </Button>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente el establecimiento {facility.name}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                  <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="w-full sm:w-auto">
                    {isDeleting ? "Eliminando..." : "Eliminar"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

