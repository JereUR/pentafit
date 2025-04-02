import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"
import type { DiaryPlanData } from "@/types/user"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<NextResponse<{ diaryPlans: DiaryPlanData[] } | { error: string }>> {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const facilityId = (await params).facilityId

    const userPlan = await prisma.userPlan.findFirst({
      where: {
        userId: user.id,
        isActive: true,
        plan: {
          facilityId: facilityId,
        },
      },
      include: {
        plan: true,
      },
    })

    const plan = userPlan
      ? await prisma.plan.findUnique({
          where: {
            id: userPlan.planId,
          },
          include: {
            diaryPlans: {
              include: {
                activity: {
                  include: {
                    diaries: {
                      where: {
                        isActive: true,
                        dateUntil: {
                          gte: new Date(),
                        },
                      },
                      include: {
                        daysAvailable: true,
                        offerDays: true,
                      },
                    },
                  },
                },
              },
            },
          },
        })
      : null

    if (!plan) {
      return NextResponse.json({ diaryPlans: [] })
    }

    const formattedDiaryPlans: DiaryPlanData[] = plan.diaryPlans.map(
      (diaryPlan) => ({
        id: diaryPlan.id,
        name: diaryPlan.name,
        daysOfWeek: diaryPlan.daysOfWeek,
        sessionsPerWeek: diaryPlan.sessionsPerWeek,
        planId: diaryPlan.planId,
        activityId: diaryPlan.activityId,
        activity: {
          id: diaryPlan.activity.id,
          name: diaryPlan.activity.name,
          description: diaryPlan.activity.description,
          activityType: diaryPlan.activity.activityType,
        },
        diaries: diaryPlan.activity.diaries.map((diary) => ({
          id: diary.id,
          name: diary.name,
          typeSchedule: diary.typeSchedule,
          dateFrom: diary.dateFrom,
          dateUntil: diary.dateUntil,
          repeatFor: diary.repeatFor,
          termDuration: diary.termDuration,
          amountOfPeople: diary.amountOfPeople,
          isActive: diary.isActive,
          genreExclusive: diary.genreExclusive,
          worksHolidays: diary.worksHolidays,
          observations: diary.observations,
          facilityId: diary.facilityId,
          offerDays: diary.offerDays.map((offerDay) => ({
            isOffer: offerDay.isOffer,
            discountPercentage: offerDay.discountPercentage,
          })),
          daysAvailable: diary.daysAvailable.map((day) => ({
            id: day.id,
            available: day.available,
            timeStart: day.timeStart,
            timeEnd: day.timeEnd,
          })),
        })),
      }),
    )

    return NextResponse.json({ diaryPlans: formattedDiaryPlans })
  } catch (error) {
    console.error("Error fetching diary plans:", error)
    return NextResponse.json(
      { error: "Error al cargar los planes de agenda" },
      { status: 500 },
    )
  }
}
