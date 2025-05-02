import { type NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"
import type { StaffDiaryData } from "@/types/diary"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<NextResponse<{ diaries: StaffDiaryData[] } | { error: string }>> {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {facilityId}=(await params)

    const userFacility = await prisma.userFacility.findFirst({
      where: {
        userId: user.id,
        facilityId,
      },
    })

    if (!userFacility) {
      return NextResponse.json(
        { error: "No tienes acceso a esta instalación" },
        { status: 403 }
      )
    }

    const staffActivities = await prisma.activityStaff.findMany({
      where: {
        userId: user.id,
        activity: {
          facilityId,
        },
      },
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
                facility: true,
              },
              orderBy: {
                dateFrom: "asc",
              },
            },
          },
        },
      },
    })

    const formattedDiaries: StaffDiaryData[] = staffActivities.flatMap(
      (staffActivity) =>
        staffActivity.activity.diaries.map((diary) => ({
          id: diary.id,
          name: diary.name,
          activity: {
            id: staffActivity.activity.id,
            name: staffActivity.activity.name,
            description: staffActivity.activity.description || undefined,
            activityType: staffActivity.activity.activityType,
          },
          facility: {
            id: diary.facility.id,
            name: diary.facility.name,
          },
          typeSchedule: diary.typeSchedule,
          dateFrom: diary.dateFrom,
          dateUntil: diary.dateUntil,
          termDuration: diary.termDuration,
          amountOfPeople: diary.amountOfPeople,
          genreExclusive: diary.genreExclusive,
          worksHolidays: diary.worksHolidays,
          observations: diary.observations || undefined,
          daysAvailable: diary.daysAvailable
            .map((day) => ({
              id: day.id,
              dayOfWeek: day.dayOfWeek,
              available: day.available,
              timeStart: day.timeStart,
              timeEnd: day.timeEnd,
            }))
            .sort((a, b) => a.dayOfWeek - b.dayOfWeek), 
          offerDays: diary.offerDays.map((offerDay) => ({
            id: offerDay.id,
            isOffer: offerDay.isOffer,
            discountPercentage: offerDay.discountPercentage || undefined,
          })),
        }))
    )

    return NextResponse.json({ diaries: formattedDiaries })
  } catch (error) {
    console.error("Error fetching staff diaries:", error)
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Error desconocido al cargar las agendas"

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}