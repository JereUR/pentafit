import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { MembershipLevel } from '@prisma/client'

interface MembershipDialogProps {
  isOpen: boolean
  onClose: () => void
  currentMembership: MembershipLevel
  onUpdateMembership: (newMembership: MembershipLevel) => void
}

const membershipOptions = [
  { level: MembershipLevel.STANDARD, price: 9.99, description: "Acceso básico a todas las instalaciones" },
  { level: MembershipLevel.PREMIUM, price: 19.99, description: "Acceso premium con clases grupales incluidas" },
  { level: MembershipLevel.FULL, price: 29.99, description: "Acceso completo con entrenador personal" },
]

export function MembershipDialog({ isOpen, onClose, currentMembership, onUpdateMembership }: MembershipDialogProps) {
  const [selectedMembership, setSelectedMembership] = useState<MembershipLevel>(currentMembership)

  const handleSubmit = () => {
    onUpdateMembership(selectedMembership)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Actualizar Membresía</DialogTitle>
          <DialogDescription>
            Elige el nivel de membresía que mejor se adapte a tus necesidades.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup value={selectedMembership} onValueChange={(value) => setSelectedMembership(value as MembershipLevel)}>
            {membershipOptions.map((option) => (
              <div key={option.level} className="flex items-center space-x-2 mb-4">
                <RadioGroupItem value={option.level} id={option.level} />
                <Label htmlFor={option.level} className="flex-grow">
                  <span className="font-semibold">{option.level}</span>
                  <span className="ml-2 text-muted-foreground">${option.price}/mes</span>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Actualizar y Pagar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

