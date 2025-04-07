import { type NextRequest, NextResponse } from "next/server"
import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
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

    const userId = user.id
    const facilityId = (await params).facilityId

    const userFacility = await prisma.userFacility.findUnique({
      where: {
        userId_facilityId: {
          userId,
          facilityId,
        },
      },
    })

    if (!userFacility) {
      return NextResponse.json(
        { error: "User does not belong to this facility" },
        { status: 403 },
      )
    }

    const today = getCurrentDayOfWeek()

    const argentinaDate = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "America/Argentina/Buenos_Aires",
      }),
    )

    const userDiaries = await prisma.userDiary.findMany({
      where: {
        userId,
        isActive: true,
        diaryPlan: {
          plan: {
            facilityId,
          },
        },
        OR: [
          {
            endDate: null,
          },
          {
            endDate: {
              gte: argentinaDate,
            },
          },
        ],
        startDate: {
          lte: argentinaDate,
        },
      },
      include: {
        diaryPlan: {
          include: {
            activity: true,
          },
        },
        attachments: {
          include: {
            dayAvailable: true,
          },
        },
      },
    })

    let dayIndex: number

    switch (today) {
      case DayOfWeek.MONDAY:
        dayIndex = 0
        break
      case DayOfWeek.TUESDAY:
        dayIndex = 1
        break
      case DayOfWeek.WEDNESDAY:
        dayIndex = 2
        break
      case DayOfWeek.THURSDAY:
        dayIndex = 3
        break
      case DayOfWeek.FRIDAY:
        dayIndex = 4
        break
      case DayOfWeek.SATURDAY:
        dayIndex = 5
        break
      case DayOfWeek.SUNDAY:
        dayIndex = 6
        break
      default:
        dayIndex = 0
    }

    const todayDiaries = userDiaries.filter((diary) => {
      const isDiaryForToday = diary.diaryPlan.daysOfWeek[dayIndex]
      return isDiaryForToday
    })

    if (!todayDiaries.length) {
      return NextResponse.json({
        success: true,
        data: null,
      })
    }

    const data = todayDiaries.map((diary) => ({
      id: diary.id,
      diaryPlanId: diary.diaryPlanId,
      activityName: diary.diaryPlan.activity.name,
      activityDescription: diary.diaryPlan.activity.description,
      planName: diary.diaryPlan.name,
      schedule: diary.attachments
        .filter((attachment) => attachment.dayAvailable.available)
        .map((attachment) => ({
          id: attachment.id,
          timeStart: attachment.dayAvailable.timeStart,
          timeEnd: attachment.dayAvailable.timeEnd,
        }))
        .sort((a, b) => {
          const aTime = a.timeStart.split(":").map(Number)
          const bTime = b.timeStart.split(":").map(Number)
          return aTime[0] * 60 + aTime[1] - (bTime[0] * 60 + bTime[1])
        }),
    }))

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error fetching today's diary:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener el diario de hoy",
      },
      { status: 500 },
    )
  }
}
