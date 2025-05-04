import { type NextRequest, NextResponse } from "next/server"

import { validateRequest } from "@/auth"
import { getCurrentDayOfWeek } from "@/lib/utils"
import { DayOfWeek } from "@prisma/client"
import prisma from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
) {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {facilityId} = (await params)

    if (!facilityId) {
      return NextResponse.json(
        { error: "Facility ID is required" },
        { status: 400 },
      )
    }

    const currentDayOfWeek = getCurrentDayOfWeek()
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

    const userDiaries = await prisma.userDiary.findMany({
      where: {
        userId: user.id,
        isActive: true,
        diaryPlan: {
          plan: {
            facilityId: facilityId,
          },
        },
      },
      include: {
        diaryPlan: {
          include: {
            plan: true,
            activity: {
              include: {
                diaries: {
                  where: {
                    facilityId: facilityId,
                    isActive: true,
                  },
                  include: {
                    activity: {
                      select: {
                        id: true,
                        name: true,
                        description: true
                      }
                    },
                    daysAvailable: true,
                  },
                },
              },
            },
          },
        },
        attachments: {
          include: {
            dayAvailable: true,
          },
        },
      },
    })

    const todayDiaries = userDiaries
      .filter(userDiary => {
        const diary = userDiary.diaryPlan?.activity?.diaries?.[0]
        if (!diary) return false

        const hasDayAvailable = diary.daysAvailable.some(
          day => day.dayOfWeek === currentDayIndex && day.available
        )

        return hasDayAvailable
      })
      .map(userDiary => {
        const diary = userDiary.diaryPlan.activity.diaries[0]
        
        const todayDayAvailable = diary.daysAvailable.find(
          day => day.dayOfWeek === currentDayIndex && day.available
        )

        const todayAttachments = userDiary.attachments?.filter(
          attachment => attachment.dayAvailable.dayOfWeek === currentDayIndex
        ) || []

        const todaySchedule = todayAttachments.length > 0
          ? todayAttachments.map(attachment => ({
              id: attachment.dayAvailable.id,
              timeStart: attachment.dayAvailable.timeStart,
              timeEnd: attachment.dayAvailable.timeEnd,
            }))
          : todayDayAvailable
            ? [{
                id: todayDayAvailable.id,
                timeStart: todayDayAvailable.timeStart,
                timeEnd: todayDayAvailable.timeEnd,
              }]
            : []

        todaySchedule.sort((a, b) => {
          const aTime = a.timeStart.split(":").map(Number)
          const bTime = b.timeStart.split(":").map(Number)
          return aTime[0] * 60 + aTime[1] - (bTime[0] * 60 + bTime[1])
        })

        return {
          id: diary.id,
          userDiaryId: userDiary.id,
          diaryPlanId: userDiary.diaryPlan.id,
          activityName: diary.activity?.name || '', 
          activityDescription: diary.activity?.description || '',
          planName: userDiary.diaryPlan.name,
          schedule: todaySchedule,
        }
      })
      .filter(diary => diary.schedule.length > 0)

    return NextResponse.json({
      success: true,
      data: todayDiaries,
    })
  } catch (error) {
    console.error("[FACILITY_ID_DIARIES_TODAY_GET]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
