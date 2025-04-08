"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUserDiaries } from "@/hooks/useUserDiaries"
import { useCalendarEvents } from "@/hooks/useCalendarEvents"
import WeeklyCalendarViewSkeleton from "../skeletons/WeeklyCalendarViewSkeleton"
import { useWeeklyCalendar } from "@/hooks/useWeeklyCalendar"
import { DAY_DISPLAY_NAMES, getCurrentDayOfWeek } from "@/lib/utils"

interface WeeklyCalendarViewProps {
  facilityId: string
  primaryColor: string
}

export function WeeklyCalendarView({ facilityId, primaryColor }: WeeklyCalendarViewProps) {
  const { data, isLoading } = useUserDiaries(facilityId)

  const currentDayEnum = getCurrentDayOfWeek()
  const currentDayName = DAY_DISPLAY_NAMES[currentDayEnum].slice(0, 3)

  const {
    weekDays: emptyWeekDays,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    isCurrentWeek,
    formatWeekRange,
  } = useWeeklyCalendar()

  const weekDays = useCalendarEvents(data?.userDiaries, emptyWeekDays)

  const [matchingDayName, setMatchingDayName] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("")

  useEffect(() => {
    if (weekDays.length > 0) {
      const matchingDay = weekDays.find((day) => day.dayName === currentDayName)
      const dayName = matchingDay ? matchingDay.dayName : weekDays[0].dayName

      setMatchingDayName(dayName)
      setActiveTab(dayName)
    }
  }, [weekDays, currentDayName])

  const currentDayStyle = {
    backgroundColor: primaryColor,
    color: "#ffffff",
  }

  const currentDayBorderStyle = {
    borderColor: primaryColor,
    backgroundColor: `${primaryColor}10`,
  }

  if (isLoading) return <WeeklyCalendarViewSkeleton primaryColor={primaryColor} />

  if (!data?.userDiaries || data.userDiaries.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Mi Calendario de Actividades</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="rounded-full bg-card p-4 mb-4">
            <Calendar className="h-10 w-10" style={{ color: primaryColor }} />
          </div>
          <h3 className="text-lg font-medium mb-2">No hay agendas disponibles</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            No estás suscrito a ninguna agenda. Suscríbete a una agenda para ver tus actividades programadas.
          </p>
        </CardContent>
      </Card>
    )
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
        <Tabs defaultValue={matchingDayName} className="w-full" onValueChange={(value) => setActiveTab(value)}>
          <TabsList className="grid w-full grid-cols-7 mb-4 h-fit">
            {weekDays.map((day) => {
              const isToday = day.dayName === currentDayName
              const isActive = day.dayName === activeTab
              return (
                <TabsTrigger
                  key={`tab-${day.date.toISOString()}`}
                  value={day.dayName}
                  className="text-xs border rounded-md m-0.5"
                  style={{
                    borderColor: isToday ? primaryColor : "inherit",
                    borderWidth: isToday ? "2px" : "1px",
                    backgroundColor: isActive ? primaryColor : "transparent",
                    color: isActive ? "white" : "inherit",
                  }}
                >
                  {day.dayName}
                </TabsTrigger>
              )
            })}
          </TabsList>
          {weekDays.map((day) => {
            const isToday = day.dayName === currentDayName
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
              </TabsContent>
            )
          })}
        </Tabs>
      </CardContent>
      <CardContent className="pt-2 pb-4 overflow-x-auto hidden sm:block">
        <div className="grid grid-cols-7 gap-1 min-w-[700px]">
          {weekDays.map((day) => {
            const isToday = day.dayName === currentDayName
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
            const isToday = day.dayName === currentDayName
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
