import { type NextRequest, NextResponse } from "next/server"

import { validateRequest } from "@/auth"
import type { UserDiaryData } from "@/types/user"
import { getUserDiaries } from "@/app/(main)/(authenticated)/(client)/[facilityId]/mi-agenda/actions"
import { getCurrentDayOfWeek } from "@/lib/utils"
import { DayOfWeek } from "@prisma/client"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
) {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const facilityId = (await params).facilityId

    if (!facilityId) {
      return NextResponse.json(
        { error: "Facility ID is required" },
        { status: 400 },
      )
    }

    const currentDayOfWeek = getCurrentDayOfWeek()

    const { userDiaries } = await getUserDiaries(facilityId)

    const dayOfWeekToIndex = {
      [DayOfWeek.SUNDAY]: 0,
      [DayOfWeek.MONDAY]: 1,
      [DayOfWeek.TUESDAY]: 2,
      [DayOfWeek.WEDNESDAY]: 3,
      [DayOfWeek.THURSDAY]: 4,
      [DayOfWeek.FRIDAY]: 5,
      [DayOfWeek.SATURDAY]: 6,
    }

    const currentDayIndex = dayOfWeekToIndex[currentDayOfWeek]

    const todayDiaries = userDiaries.filter((userDiary: UserDiaryData) => {
      if (!userDiary.diary?.daysAvailable || !userDiary.selectedDays) {
        return false
      }

      return userDiary.selectedDays.some((selectedDay) => {
        const dayAvailable = userDiary.diary.daysAvailable.find(
          (day) => day.id === selectedDay.id,
        )

        if (dayAvailable) {
          const dayIndex = userDiary.diary.daysAvailable.indexOf(dayAvailable)
          return dayIndex === currentDayIndex
        }

        return false
      })
    })

    const data = todayDiaries.map((diary: UserDiaryData) => {
      const todaySchedule = (diary.selectedDays || [])
        .filter((day) => {
          const dayAvailable = diary.diary.daysAvailable.find(
            (d) => d.id === day.id,
          )
          if (dayAvailable) {
            const dayIndex = diary.diary.daysAvailable.indexOf(dayAvailable)
            return dayIndex === currentDayIndex
          }
          return false
        })
        .map((day) => ({
          id: day.id,
          timeStart: day.timeStart,
          timeEnd: day.timeEnd,
        }))
        .sort((a, b) => {
          const aTime = a.timeStart.split(":").map(Number)
          const bTime = b.timeStart.split(":").map(Number)
          return aTime[0] * 60 + aTime[1] - (bTime[0] * 60 + bTime[1])
        })

      return {
        id: diary.id,
        diaryPlanId: diary.diaryPlan?.id || "",
        activityName: diary.diary?.activity?.name || "",
        activityDescription: diary.diary?.activity?.description || "",
        planName: diary.diaryPlan?.name || "",
        schedule: todaySchedule,
      }
    })

    const filteredData = data.filter((item) => item.schedule.length > 0)

    return NextResponse.json({
      success: true,
      data: filteredData,
    })
  } catch (error) {
    console.error("[FACILITY_ID_DIARIES_TODAY_GET]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
