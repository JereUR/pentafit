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
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={facility.logoUrl || (noLogoImage.src as string)} alt={facility.name} />
          <AvatarFallback>{facility.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle>{facility.name}</CardTitle>
          <CardDescription>{facility.description}</CardDescription>
        </div>
        <div className="flex gap-2">
          <Badge variant={facility.isActive ? "default" : "secondary"}>
            {facility.isActive ? "Active" : "Inactive"}
          </Badge>
          <Badge variant={facility.isWorking ? "default" : "secondary"}>
            {facility.isWorking ? "Working" : "Not Working"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button
            onClick={onWorkingChange}
            variant={isWorking ? "default" : "outline"}
            className="flex-1"
          >
            {isWorking ? "Seleccionado" : "Seleccionar"}
          </Button>
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
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}

