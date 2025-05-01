import { useState } from 'react'
import { Info } from 'lucide-react'

import { Dialog, DialogContent, DialogHeader, DialogPortal, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Checkbox } from '../ui/checkbox'
import { daysOfWeekFull } from '@/lib/utils'
import { Schedule } from '@/types/diary'

interface DaysAvailablesDialogProps {
  name: string
  daysAvailables: Schedule[]
}

export default function DaysAvailablesDialog({ name, daysAvailables }: DaysAvailablesDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="flex items-center justify-center">
      <span>{daysAvailables.length}</span>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="ml-2">
            <Info className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogContent className="sm:max-w-[80%] md:max-w-[60%] lg:max-w-[50%] xl:max-w-[40%] h-[80vh] flex flex-col rounded-md">
            <DialogHeader>
              <DialogTitle>Días disponibles en {name}</DialogTitle>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto scrollbar-thin">
              <div className="max-h-[60vh] overflow-auto scrollbar-thin">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8/12 md:w-1/2 text-center whitespace-normal">Días de la semana</TableHead>
                      <TableHead className="w-2/12 md:w-1/4 text-center whitespace-normal">Horario inicio</TableHead>
                      <TableHead className="w-2/12 md:w-1/4 text-center whitespace-normal">Horario fin</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {daysAvailables.map((day, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-medium">
                              {daysOfWeekFull[day.dayOfWeek]}
                            </span>
                            <Checkbox checked={day.available} disabled className="mt-1" />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{day.available ? `${day.timeStart}hs` : '-'}</TableCell>
                        <TableCell className="text-center">{day.available ? `${day.timeEnd}hs` : '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  )
}
