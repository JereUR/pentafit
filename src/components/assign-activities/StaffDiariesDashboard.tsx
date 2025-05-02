"use client"

import { useStaffDiaries } from "@/hooks/useStaffDiaries"
import { daysOfWeekFull } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { hoursOfDays } from "@/types/diary"
import { Skeleton } from "../ui/skeleton"
import { useWorkingFacility } from "@/contexts/WorkingFacilityContext"
import DaySchedule from "./DaySchedule"

export default function StaffDiariesDashboard() {
  const { workingFacility } = useWorkingFacility()
  const { data, isLoading, error } = useStaffDiaries(workingFacility?.id)

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error) {
    return <div>Error al cargar las agendas</div>
  }

  const diaries = data?.diaries || []

  return (
    <div className="w-full overflow-x-auto border rounded-md px-2 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-primary">
        Mis Horarios de Trabajo
      </h1>
      <Tabs defaultValue={daysOfWeekFull[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mb-4 h-fit">
          {daysOfWeekFull.map((day) => (
            <TabsTrigger
              key={day}
              value={day}
              className="text-xs sm:text-sm border border-primary rounded-md m-1 xl:border-none xl:m-0"
            >
              <span className="xl:hidden">{day.slice(0, 3)}</span>
              <span className="hidden xl:flex">{day}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        {daysOfWeekFull.map((day, dayIndex) => (
          <TabsContent
            key={day}
            value={day}
            className="w-full overflow-x-auto border rounded-md scrollbar-thin mt-2 sm:mt-4"
          >
            <DaySchedule
              hours={hoursOfDays}
              schedules={diaries
                .filter(diary =>
                  diary.daysAvailable.some(day =>
                    day.dayOfWeek === dayIndex &&
                    day.available
                  )
                )
                .map(diary => ({
                  name: `${diary.activity.name} (${diary.facility.name})`,
                  schedule: diary.daysAvailable.find(day => day.dayOfWeek === dayIndex)!
                }))
              }
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}