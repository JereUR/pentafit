"use client"

import { useState } from "react"
import { Copy } from "lucide-react"


import noImage from '@/assets/no-image.png'
import { Button } from "@/components/ui/button"
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useFacilities } from "@/hooks/useFacilities"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

interface ReplicateConfirmationDialogProps {
  itemName: string
  onReplicate: (targetFacilityIds: string[]) => void
  isReplicating: boolean
  buttonClassName?: string
  count?: number
  userId: string
  workingFacilityId: string
}

export function ReplicateConfirmationDialog({
  itemName,
  onReplicate,
  isReplicating,
  buttonClassName = "w-full sm:w-auto",
  count,
  workingFacilityId,
  userId
}: ReplicateConfirmationDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])
  const { facilities } = useFacilities(userId)

  const handleReplicate = () => {
    onReplicate(selectedFacilities)
    setIsOpen(false)
    setSelectedFacilities([])
  }

  const toggleFacility = (facilityId: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facilityId) ? prev.filter((id) => id !== facilityId) : [...prev, facilityId],
    )
  }

  const availableFacilities = facilities ? facilities.filter((facility) => facility.id !== workingFacilityId) : []

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className={buttonClassName} onClick={(e) => e.stopPropagation()}>
          <Copy className="mr-2 h-4 w-4" /> Replicar en establecimiento {count && `(${count})`}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Replicar actividades</AlertDialogTitle>
          <AlertDialogDescription>
            Selecciona los establecimientos donde deseas replicar {itemName}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Seleccionar establecimientos ({selectedFacilities.length})</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Establecimientos disponibles</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableFacilities.map((facility) => (
              <DropdownMenuCheckboxItem
                key={facility.id}
                checked={selectedFacilities.includes(facility.id)}
                onCheckedChange={() => toggleFacility(facility.id)}
              >
                <div className='flex items-center gap-2'>
                <Avatar className="w-6 h-6">
                  <AvatarImage src={facility.logoUrl || (noImage.src as string)} alt={facility.name} />
                  <AvatarFallback>{facility.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className='text-sm md:text-base'>{facility.name}</span>
              </div>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReplicate}
            disabled={isReplicating || selectedFacilities.length === 0}
            className="w-full sm:w-auto"
          >
            {isReplicating ? "Replicando..." : "Replicar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

