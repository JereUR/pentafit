'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
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

interface DeleteConfirmationDialogProps {
  itemName: string
  onDelete: () => void
  isDeleting: boolean
  buttonClassName?: string
  count?: number
}

export function DeleteConfirmationDialog({
  itemName,
  onDelete,
  isDeleting,
  buttonClassName = "w-full sm:w-auto",
  count
}: DeleteConfirmationDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = () => {
    onDelete()
    setIsOpen(false)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className={buttonClassName} onClick={(e) => e.stopPropagation()}>
          <Trash2 className="mr-2 h-4 w-4" /> Eliminar {count && `(${count})`}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente {itemName}.
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
  )
}
