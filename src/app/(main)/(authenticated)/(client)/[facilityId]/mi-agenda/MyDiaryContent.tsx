'use client'

import { CalendarIcon, ListTodo } from 'lucide-react'

import DiaryPlansView from '@/components/my-diaries/DiaryPlansView'
import { WeeklyCalendarView } from '@/components/my-diaries/WeeklyCalendarView'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useClientFacility } from '@/contexts/ClientFacilityContext'


export default function MyDiaryContent({ facilityId }: { facilityId: string }) {
  const { primaryColor } = useClientFacility()

  return (
    <div>
      <div className="sm:hidden mb-6">
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="activities"
              className="flex items-center gap-2 data-[state=active]:bg-[var(--tab-color)] data-[state=active]:text-white rounded-md"
              style={{ ['--tab-color' as string]: primaryColor }}
            >
              <ListTodo className="h-4 w-4" />
              <span>Actividades</span>
            </TabsTrigger>

            <TabsTrigger
              value="calendar"
              className="flex items-center gap-2 data-[state=active]:bg-[var(--tab-color)] data-[state=active]:text-white rounded-md"
              style={{ ['--tab-color' as string]: primaryColor }}
            >
              <CalendarIcon className="h-4 w-4" />
              <span>Calendario</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="activities" className="mt-4">
            <DiaryPlansView facilityId={facilityId} primaryColor={primaryColor} />
          </TabsContent>
          <TabsContent value="calendar" className="mt-4">
            <WeeklyCalendarView facilityId={facilityId} primaryColor={primaryColor} />
          </TabsContent>
        </Tabs>
      </div>
      <div className="hidden py-2 md:py-5 sm:flex sm:flex-col sm:gap-6">
        <DiaryPlansView facilityId={facilityId} primaryColor={primaryColor} />
        <WeeklyCalendarView facilityId={facilityId} primaryColor={primaryColor} />
      </div></div>
  )
}
