import { daysOfWeekFull } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import DaySchedule from "./DaySchedule"
import { DiaryData, hoursOfDays } from "@/types/diary"

interface WeeklyScheduleDashboardProps {
  diaryData: DiaryData[]
}

export default function WeeklyScheduleDashboard({ diaryData }: WeeklyScheduleDashboardProps) {
  const activeDiaries = diaryData.filter((diary) => diary.isActive)

  return (
    <div className="w-full overflow-x-auto border rounded-md px-2 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-primary">Horarios Semanales</h1>
      <Tabs defaultValue={daysOfWeekFull[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mb-4 h-fit">
          {daysOfWeekFull.map((day) => (
            <TabsTrigger key={day} value={day} className="text-xs sm:text-sm border border-primary rounded-md m-1 xl:border-none xl:m-0">
              <span className='xl:hidden'>{day.slice(0, 3)}</span>
              <span className='hidden xl:flex'>{day}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        {daysOfWeekFull.map((day, idx) => (
          <TabsContent key={day} value={day} className="w-full overflow-x-auto border rounded-md scrollbar-thin mt-2 sm:mt-4">
            <DaySchedule
              hours={hoursOfDays}
              schedules={activeDiaries.map((data) => ({
                name: data.name,
                schedule: data.daysAvailable[idx],
              }))}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}