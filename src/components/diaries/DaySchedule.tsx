import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Schedule } from "@/types/diary"

interface DayScheduleProps {
  hours: string[]
  schedules: {
    name: string
    schedule: Schedule
  }[]
}

export default function DaySchedule({ hours, schedules }: DayScheduleProps) {
  const isWithinSchedule = (hour: string, schedule: Schedule) => {
    return schedule.available && hour >= schedule.timeStart && hour < schedule.timeEnd
  }

  const availableSchedules = schedules.filter(({ schedule }) => schedule.available)

  const isHourFree = (hour: string) => {
    return !availableSchedules.some(({ schedule }) => isWithinSchedule(hour, schedule))
  }

  return (
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px] sticky left-0 bg-background z-20">Nombre</TableHead>
            {hours.map((hour) => (
              <TableHead key={hour} className="text-center p-2 text-xs sm:text-sm">
                {hour}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {availableSchedules.map(({ name, schedule }) => (
            <TableRow key={name}>
              <TableCell className="font-medium sticky left-0 bg-background z-10">{name}</TableCell>
              {hours.map((hour) => (
                <TableCell
                  key={`${name}-${hour}`}
                  className={`text-center p-2 ${isWithinSchedule(hour, schedule) ? "bg-primary/20 dark:bg-primary/40" : ""
                    }`}
                >
                  {isWithinSchedule(hour, schedule) ? "✓" : ""}
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableCell className="font-medium sticky left-0 bg-background z-10">Horarios Libres</TableCell>
            {hours.map((hour) => (
              <TableCell
                key={`free-${hour}`}
                className={`text-center p-2 ${isHourFree(hour) ? "bg-green-200 dark:bg-green-800" : ""}`}
              >
                {isHourFree(hour) ? "✓" : ""}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
  )
}
