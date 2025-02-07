import { useState } from 'react'
import { Info } from 'lucide-react'

import { Dialog, DialogContent, DialogHeader, DialogPortal, DialogTitle, DialogTrigger } from '../ui/dialog'
import { OfferDays } from '@/types/diary'
import { Button } from '../ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Checkbox } from '../ui/checkbox'
import { daysOfWeekFull } from '@/lib/utils'

interface OfferDaysDialogProps {
  name: string
  offerDays: OfferDays[]
}

export default function OfferDaysDialog({ name, offerDays }: OfferDaysDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const countOfferDays = offerDays.filter(day => day.isOffer).length

  return (
    <div className="flex items-center justify-center">
      <span>{countOfferDays}</span>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="ml-2">
            <Info className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogContent className="sm:max-w-[80%] md:max-w-[60%] lg:max-w-[50%] xl:max-w-[40%] h-fit flex flex-col rounded-md">
            <DialogHeader>
              <DialogTitle>Días de oferta en {name}</DialogTitle>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto scrollbar-thin">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center" colSpan={7}>
                      Días de la semana
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="justify-center">
                    {offerDays.map((day, index) => (
                      <TableCell key={index} className="h-24 align-top p-2">
                        <div className="flex flex-col items-center justify-start h-full">
                          <span className="text-xs font-medium">{daysOfWeekFull[index]}</span>
                          <Checkbox checked={day.isOffer} disabled className="mt-1" />
                          {day.isOffer && (
                            <span className="text-xs text-foreground/70 italic mt-2">- {day.discountPercentage}%</span>
                          )}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  )
}
