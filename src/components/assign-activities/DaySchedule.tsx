"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Schedule } from "@/types/diary"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { cn } from "@/lib/utils"

interface DayScheduleProps {
  hours: string[]
  schedules: {
    name: string
    schedule: Schedule
  }[]
}

export default function DaySchedule({ hours, schedules }: DayScheduleProps) {
  const timeToMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number)
    return h * 60 + m
  }

  const isWithinSchedule = (hour: string, schedule: Schedule) => {
    if (!schedule.available) return false

    const hourMinutes = timeToMinutes(hour)
    const startMinutes = timeToMinutes(schedule.timeStart)
    const endMinutes = timeToMinutes(schedule.timeEnd)

    return hourMinutes >= startMinutes && hourMinutes < endMinutes
  }

  const availableSchedules = schedules.filter(({ schedule }) => schedule.available)

  const isHourFree = (hour: string) => {
    return !availableSchedules.some(({ schedule }) => isWithinSchedule(hour, schedule))
  }

  return (
    <TooltipProvider>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px] sticky left-0 bg-background z-20">Actividad</TableHead>
            {hours.map((hour) => (
              <TableHead key={hour} className="text-center p-2 text-xs sm:text-sm">
                {hour}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {availableSchedules.map(({ name, schedule }) => (
            <TableRow key={`${name}-${schedule.timeStart}`}>
              <TableCell className="font-medium sticky left-0 bg-background z-10">
                {name}
              </TableCell>
              {hours.map((hour) => {
                const isActive = isWithinSchedule(hour, schedule)
                const isFirstHour = hour === schedule.timeStart

                return (
                  <Tooltip key={`${name}-${hour}`}>
                    <TooltipTrigger asChild>
                      <TableCell
                        className={cn(
                          "text-center p-2",
                          isActive ? "bg-primary/20 dark:bg-primary/40" : "",
                          isFirstHour ? "border-l-2 border-primary/50" : ""
                        )}
                      >
                      </TableCell>
                    </TooltipTrigger>
                    <TooltipContent className="bg-background border border-primary/20 shadow-lg">
                      <div className="p-2 space-y-1">
                        <h4 className="font-bold">{name}</h4>
                        <p>Horario: {schedule.timeStart} - {schedule.timeEnd}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </TableRow>
          ))}
          <TableRow>
            <TableCell className="font-medium sticky left-0 bg-background z-10">
              Horarios Libres
            </TableCell>
            {hours.map((hour) => (
              <TableCell
                key={`free-${hour}`}
                className={cn(
                  "text-center p-2",
                  isHourFree(hour) ? "bg-green-200 dark:bg-green-800" : ""
                )}
              >
                {isHourFree(hour) ? "✓" : ""}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TooltipProvider>
  )
}