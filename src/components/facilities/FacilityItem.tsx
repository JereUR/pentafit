'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Trash2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

interface FacilityItemProps {
  facility: FacilityReduceData
  isWorking: boolean
  onWorkingChange: () => void
}

export function FacilityItem({ facility, isWorking, onWorkingChange }: FacilityItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDelete = () => {
    console.log(`Deleting facility: ${facility.id}`)
    setIsDeleteDialogOpen(false)
  }

  return (
    <Card className={`mb-4 ${isWorking ? 'border-primary' : ''}`}>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Avatar className="w-16 h-16 sm:w-10 sm:h-10">
          <AvatarImage src={facility.logoUrl || (noLogoImage.src as string)} alt={facility.name} />
          <AvatarFallback>{facility.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-xl sm:text-lg">{facility.name}</CardTitle>
          <CardDescription className="mt-1 text-sm">{facility.description}</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          <Badge variant={facility.isActive ? "default" : "secondary"}>
            {facility.isActive ? "Active" : "Inactive"}
          </Badge>
          <Badge variant={facility.isWorking ? "default" : "secondary"}>
            {facility.isWorking ? "Working" : "Not Working"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={onWorkingChange}
            variant={isWorking ? "default" : "outline"}
            className="w-full sm:flex-1"
          >
            {isWorking ? "Seleccionado" : "Seleccionar"}
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href={`/establecimientos/editar/${facility.id}`}>
              <Edit className="mr-2 h-4 w-4" /> Editar
            </Link>
          </Button>
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto">
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
                <AlertDialogAction onClick={handleDelete} className="w-full sm:w-auto">Eliminar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}
