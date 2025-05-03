import { useState, useEffect } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUserDiaries } from "@/hooks/useUserDiaries"
import { useCalendarEvents } from "@/hooks/useCalendarEvents"
import WeeklyCalendarViewSkeleton from "../skeletons/WeeklyCalendarViewSkeleton"
import { useWeeklyCalendar } from "@/hooks/useWeeklyCalendar"
import { DAY_DISPLAY_NAMES, getCurrentDayOfWeek } from "@/lib/utils"
import { useDiaryAttendanceMutation } from "@/app/(main)/(authenticated)/(client)/[facilityId]/mi-agenda/mutations"
import { WeekNavigation } from "./WeekNavigation"
import { NoDiariesMessage } from "./NoDiariesMessage"
import { DayColumn } from "./DayColumn"
import { DayTabContent } from "./DayTabContent"

interface WeeklyCalendarViewProps {
  facilityId: string
  primaryColor: string
}

export function WeeklyCalendarView({ facilityId, primaryColor }: WeeklyCalendarViewProps) {
  const { data, isLoading } = useUserDiaries(facilityId)
  const { mutate: recordAttendance, isPending } = useDiaryAttendanceMutation()
  const [localAttendances, setLocalAttendances] = useState<Record<string, boolean>>({})

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

  const handleAttendance = (diaryId: string, userDiaryId: string, dayAvailableId: string, attended: boolean) => {
    const key = `${diaryId}-${dayAvailableId}`
    setLocalAttendances(prev => ({ ...prev, [key]: attended }))

    recordAttendance({
      diaryId,
      userDiaryId,
      facilityId,
      attended,
      dayOfWeek: currentDayEnum,
      dayAvailableId
    })
  }

  if (isLoading) return <WeeklyCalendarViewSkeleton primaryColor={primaryColor} />

  if (!data?.userDiaries || data.userDiaries.length === 0) {
    return <NoDiariesMessage primaryColor={primaryColor} />
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-lg">Mi Calendario de Actividades</CardTitle>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <WeekNavigation
              goToPreviousWeek={goToPreviousWeek}
              goToNextWeek={goToNextWeek}
              goToCurrentWeek={goToCurrentWeek}
              isCurrentWeek={isCurrentWeek}
            />
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
          {weekDays.map((day) => (
            <DayTabContent
              key={`tab-content-${day.date.toISOString()}`}
              day={day}
              primaryColor={primaryColor}
              currentDayName={currentDayName}
              onAttendanceChange={handleAttendance}
              localAttendances={localAttendances}
              isPending={isPending}
            />
          ))}
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
          {weekDays.map((day) => (
            <DayColumn
              key={`day-${day.date.toISOString()}`}
              day={day}
              primaryColor={primaryColor}
              currentDayBorderStyle={currentDayBorderStyle}
              onAttendanceChange={handleAttendance}
              localAttendances={localAttendances}
              isPending={isPending}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}