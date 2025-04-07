"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUserDiaries } from "@/hooks/useUserDiaries"
import { useCalendarEvents } from "@/hooks/useCalendarEvents"
import WeeklyCalendarViewSkeleton from "../skeletons/WeeklyCalendarViewSkeleton"
import { useWeeklyCalendar } from "@/hooks/useWeeklyCalendar"

interface WeeklyCalendarViewProps {
  facilityId: string
  primaryColor: string
}

export function WeeklyCalendarView({ facilityId, primaryColor }: WeeklyCalendarViewProps) {
  const { data, isLoading } = useUserDiaries(facilityId)

  const {
    weekDays: emptyWeekDays,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    isCurrentWeek,
    formatWeekRange,
  } = useWeeklyCalendar()

  const weekDays = useCalendarEvents(data?.userDiaries, emptyWeekDays)

  const currentDayStyle = {
    backgroundColor: primaryColor,
    color: "#ffffff",
  }

  const currentDayBorderStyle = {
    borderColor: primaryColor,
    backgroundColor: `${primaryColor}10`,
  }

  const getArgentinaDate = () => {
    return new Date(
      new Date().toLocaleString("es-AR", {
        timeZone: "America/Argentina/Buenos_Aires",
      }),
    )
  }

  const isArgentinaToday = (date: Date) => {
    const argentinaDate = getArgentinaDate()
    return (
      date.getDate() === argentinaDate.getDate() &&
      date.getMonth() === argentinaDate.getMonth() &&
      date.getFullYear() === argentinaDate.getFullYear()
    )
  }

  if (isLoading) return <WeeklyCalendarViewSkeleton primaryColor={primaryColor} />

  if (!data?.userDiaries || data.userDiaries.length === 0) {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-lg">Mi Calendario de Actividades</CardTitle>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button variant="outline" size="sm" onClick={goToPreviousWeek} className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Semana anterior</span>
            </Button>

            {!isCurrentWeek() && (
              <Button variant="outline" size="sm" onClick={goToCurrentWeek} className="h-8 text-xs">
                Semana actual
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={goToNextWeek} className="h-8 w-8 p-0">
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Semana siguiente</span>
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center mt-1">{formatWeekRange()}</p>
      </CardHeader>
      <CardContent className="pt-2 pb-4 block sm:hidden">
        <div className="space-y-4">
          {weekDays.map((day) => {
            const isToday = isArgentinaToday(day.date)
            return (
              <div
                key={`mobile-day-${day.date.toISOString()}`}
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
                    style={isToday ? currentDayStyle : {}}
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
                        <div
                          key={`mobile-${event.id}`}
                          className="p-2 rounded text-xs"
                          style={{ backgroundColor: `${primaryColor}20` }}
                        >
                          <div className="font-medium" style={{ color: primaryColor }}>
                            {event.title}
                          </div>
                          <div className="text-xs text-muted-foreground">{event.time}</div>
                          <div className="text-xs">{event.diaryName}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
      <CardContent className="pt-2 pb-4 overflow-x-auto hidden sm:block">
        <div className="grid grid-cols-7 gap-1 min-w-[700px]">
          {weekDays.map((day) => {
            const isToday = isArgentinaToday(day.date)
            return (
              <div key={`header-${day.date.toISOString()}`} className="text-center">
                <div className="font-medium text-xs sm:text-sm">{day.dayName}</div>
                <div
                  className="text-xs rounded-full w-6 h-6 flex items-center justify-center mx-auto"
                  style={isToday ? currentDayStyle : {}}
                >
                  {day.dayNumber}
                </div>
              </div>
            )
          })}
          {weekDays.map((day) => {
            const isToday = isArgentinaToday(day.date)
            return (
              <div
                key={`day-${day.date.toISOString()}`}
                className="border rounded-md p-1 h-[200px] overflow-y-auto"
                style={isToday ? currentDayBorderStyle : {}}
              >
                {day.events.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                    Sin actividades
                  </div>
                ) : (
                  <div className="space-y-1">
                    {day.events.map((event) => (
                      <div
                        key={event.id}
                        className="p-1 rounded text-xs"
                        style={{ backgroundColor: `${primaryColor}20` }}
                      >
                        <div className="font-medium truncate" style={{ color: primaryColor }}>
                          {event.title}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">{event.time}</div>
                        <div className="text-[10px] truncate">{event.diaryName}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

