"use client"

import { useState } from "react"
import { CalendarCheck } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useUserRoutine } from "@/hooks/useUserRoutine"
import type { DayOfWeek } from "@prisma/client"

import { RoutineEmpty } from "./RoutineEmpty"
import { RoutineCarousel } from "./RoutineCarousel"
import { DaySelector } from "./DaySelector"
import { RoutineSkeleton } from "../skeletons/RoutineSkeleton"

interface WeeklyRoutineViewProps {
  facilityId: string
  primaryColor: string
}

export function WeeklyRoutineView({ facilityId, primaryColor }: WeeklyRoutineViewProps) {
  const { isLoading, data: routineData, error, dayNames } = useUserRoutine(facilityId)
  const [activeDay, setActiveDay] = useState<DayOfWeek>("MONDAY")

  if (isLoading) {
    return <RoutineSkeleton primaryColor={primaryColor} />
  }

  if (error) {
    return <div className="p-4 text-sm text-red-500">{error}</div>
  }

  if (!routineData) {
    return <RoutineEmpty primaryColor={primaryColor} />
  }

  const dayKeys = Object.keys(dayNames) as DayOfWeek[]
  const activeExercises = routineData.dailyExercises.find((de) => de.dayOfWeek === activeDay)?.exercises || []

  return (
    <div className="space-y-6 w-full">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center gap-2">
          <CalendarCheck className="h-6 w-6" style={{ color: primaryColor }} />
          <div>
            <CardTitle>Mi Rutina: {routineData.name}</CardTitle>
            {routineData.description && <CardDescription>{routineData.description}</CardDescription>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="lg:hidden">
            <Tabs
              defaultValue="MONDAY"
              onValueChange={(value) => {
                setActiveDay(value as DayOfWeek)
              }}
            >
              <TabsList className="grid grid-cols-7 mb-6">
                {dayKeys.map((day) => (
                  <TabsTrigger
                    key={day}
                    value={day}
                    style={activeDay === day ? { backgroundColor: primaryColor, color: "white" } : {}}
                  >
                    {dayNames[day].slice(0, 3)}
                  </TabsTrigger>
                ))}
              </TabsList>

              {dayKeys.map((day) => (
                <TabsContent key={`tab-content-${day}`} value={day}>
                  {routineData.dailyExercises.find((de) => de.dayOfWeek === day) ? (
                    <RoutineCarousel
                      exercises={routineData.dailyExercises.find((de) => de.dayOfWeek === day)?.exercises || []}
                      primaryColor={primaryColor}
                      dayName={dayNames[day]}
                      dayOfWeek={day}
                      routineId={routineData.id}
                      facilityId={facilityId}
                      itemsPerPage={1}
                    />
                  ) : null}
                </TabsContent>
              ))}
            </Tabs>
          </div>
          <div className="hidden lg:block">
            <div className="flex flex-col space-y-6">
              <DaySelector
                dayKeys={dayKeys}
                dayNames={dayNames}
                activeDay={activeDay}
                setActiveDay={setActiveDay}
                primaryColor={primaryColor}
              />
              <h2 className="text-xl font-semibold text-center" style={{ color: primaryColor }}>
                Ejercicios para {dayNames[activeDay]}
              </h2>
              <RoutineCarousel
                exercises={activeExercises}
                primaryColor={primaryColor}
                dayName={dayNames[activeDay]}
                dayOfWeek={activeDay}
                routineId={routineData.id}
                facilityId={facilityId}
                itemsPerPage={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
