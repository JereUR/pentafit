import { CalendarDay } from "@/types/diaryClient"
import { EventItem } from "./EventItem"
import { DAY_DISPLAY_NAMES, getCurrentDayOfWeek, isDayTodayOrPast } from "@/lib/utils"
import { DayOfWeek } from "@prisma/client"

interface DayColumnProps {
  day: CalendarDay
  primaryColor: string
  currentDayBorderStyle: React.CSSProperties
  onAttendanceChange: (diaryId: string, userDiaryId: string, dayAvailableId: string, attended: boolean) => void
  localAttendances: Record<string, boolean>
  isPending: boolean
}

export const DayColumn = ({ day, primaryColor, currentDayBorderStyle, onAttendanceChange, localAttendances, isPending }: DayColumnProps) => {
  const isToday = day.dayName === DAY_DISPLAY_NAMES[getCurrentDayOfWeek()].slice(0, 3)
  const dayOfWeekValue = Object.keys(DAY_DISPLAY_NAMES).find(
    key => DAY_DISPLAY_NAMES[key as DayOfWeek].startsWith(day.dayName)
  ) as DayOfWeek

  const canMarkAttendance = isDayTodayOrPast(dayOfWeekValue)

  return (
    <div
      className="border rounded-md p-1 h-[200px] overflow-y-auto scrollbar-thin"
      style={isToday ? currentDayBorderStyle : {}}
    >
      {day.events.length === 0 ? (
        <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
          Sin actividades
        </div>
      ) : (
        <div className="space-y-1">
          {day.events.map((event) => (
            <EventItem
              key={event.id}
              event={event}
              primaryColor={primaryColor}
              canMarkAttendance={canMarkAttendance}
              onAttendanceChange={onAttendanceChange}
              localAttendances={localAttendances}
              isPending={isPending}
            />
          ))}
        </div>
      )}
    </div>
  )
}