"use client"

import { Button } from "@/components/ui/button"
import type { DayOfWeek } from "@prisma/client"

interface DaySelectorProps {
  dayKeys: DayOfWeek[]
  dayNames: Record<DayOfWeek, string>
  activeDay: DayOfWeek
  setActiveDay: (day: DayOfWeek) => void
  primaryColor: string
}

export function DaySelector({ dayKeys, dayNames, activeDay, setActiveDay, primaryColor }: DaySelectorProps) {
  return (
    <div className="flex justify-center flex-wrap gap-2">
      {dayKeys.map((day) => (
        <Button
          key={day}
          variant={activeDay === day ? "default" : "outline"}
          onClick={() => {
            setActiveDay(day)
          }}
          style={activeDay === day ? { backgroundColor: primaryColor, color: "white" } : {}}
          className="px-3 py-1 h-auto text-sm"
        >
          {dayNames[day]}
        </Button>
      ))}
    </div>
  )
}
