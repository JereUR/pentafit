import { EventItem } from "./EventItem"
import { TabsContent } from "@/components/ui/tabs"
import { DAY_DISPLAY_NAMES, isDayTodayOrPast } from "@/lib/utils"
import { CalendarEvent } from "@/types/diaryClient"
import { DayOfWeek } from "@prisma/client"

interface CalendarDay {
  dayName: string
  dayNumber: number
  date: Date
  events: CalendarEvent[]
}

interface DayTabContentProps {
  day: CalendarDay
  primaryColor: string
  currentDayName: string
  onAttendanceChange: (diaryId: string, userDiaryId: string, dayAvailableId: string, attended: boolean) => void
  localAttendances: Record<string, boolean>
  isPending: boolean
}

export const DayTabContent = ({ day, primaryColor, currentDayName, onAttendanceChange, localAttendances, isPending }: DayTabContentProps) => {
  const isToday = day.dayName === currentDayName
  const dayOfWeekValue = Object.keys(DAY_DISPLAY_NAMES).find(
    key => DAY_DISPLAY_NAMES[key as DayOfWeek].startsWith(day.dayName)
  ) as DayOfWeek

  const canMarkAttendance = isDayTodayOrPast(dayOfWeekValue)

  return (
    <TabsContent key={`tab-content-${day.date.toISOString()}`} value={day.dayName}>
      <div
        className={`border rounded-md overflow-hidden ${isToday ? "border-2" : ""}`}
        style={isToday ? { borderColor: primaryColor } : {}}
      >
        <div
          className="p-2 flex justify-between items-center"
          style={isToday ? { backgroundColor: `${primaryColor}20` } : {}}
        >
          <div>
            <div className="font-medium">{day.dayName}</div>
            <div className="text-sm text-muted-foreground">{day.date.toLocaleDateString()}</div>
          </div>
          <div
            className="rounded-full w-8 h-8 flex items-center justify-center"
            style={isToday ? { backgroundColor: primaryColor, color: "#ffffff" } : {}}
          >
            {day.dayNumber}
          </div>
        </div>

        <div className="p-2 max-h-[150px] overflow-y-auto">
          {day.events.length === 0 ? (
            <div className="h-12 flex items-center justify-center text-xs text-muted-foreground">
              Sin actividades
            </div>
          ) : (
            <div className="space-y-2">
              {day.events.map((event) => (
                <EventItem
                  key={`mobile-${event.id}`}
                  event={event}
                  primaryColor={primaryColor}
                  canMarkAttendance={canMarkAttendance}
                  onAttendanceChange={onAttendanceChange}
                  localAttendances={localAttendances}
                  isMobile={true}
                  isPending={isPending}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </TabsContent>
  )
}