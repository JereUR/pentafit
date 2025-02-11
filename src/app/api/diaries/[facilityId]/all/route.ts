import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import {
  AllDIaryData,
  genreExclusiveOptions,
  typeScheduleOptions,
} from "@/types/diary"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<NextResponse<{ diaries: AllDIaryData[] } | { error: string }>> {
  try {
    const id = (await params).facilityId

    const diaries = await prisma.diary.findMany({
      where: {
        facilityId: id,
      },
      select: {
        id: true,
        name: true,
        typeSchedule: true,
        dateFrom: true,
        dateUntil: true,
        repeatFor: true,
        offerDays: true,
        termDuration: true,
        amountOfPeople: true,
        isActive: true,
        genreExclusive: true,
        worksHolidays: true,
        observations: true,
        facilityId: true,
        daysAvailable: true,
        activity: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!diaries) {
      return NextResponse.json({ diaries: [] })
    }

    const formattedDiaries: AllDIaryData[] = diaries.map((diary) => ({
      id: diary.id,
      name: diary.name,
      typeSchedule:
        typeScheduleOptions.find((type) => type.key === diary.typeSchedule)
          ?.value || "",
      dateFrom: diary.dateFrom,
      dateUntil: diary.dateUntil,
      repeatFor: diary.repeatFor,
      offerDays: diary.offerDays.map((day) => ({
        isOffer: day.isOffer,
        discountPercentage: day.discountPercentage,
      })),
      termDuration: diary.termDuration,
      amountOfPeople: diary.amountOfPeople,
      isActive: diary.isActive,
      genreExclusive:
        genreExclusiveOptions.find(
          (genre) => genre.key === diary.genreExclusive,
        )?.value || "",
      worksHolidays: diary.worksHolidays,
      observations: diary.observations,
      facilityId: diary.facilityId,
      daysAvailable: diary.daysAvailable.map((day) => ({
        available: day.available,
        timeStart: day.timeStart,
        timeEnd: day.timeEnd,
      })),
      activityId: diary.activity.id,
      activityName: diary.activity.name,
    }))

    return NextResponse.json({ diaries: formattedDiaries })
  } catch (error) {
    console.error("Error fetching diaries:", error)
    return NextResponse.json(
      { error: "Error al cargar las actividades" },
      { status: 500 },
    )
  }
}
