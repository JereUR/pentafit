import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import {
  DiaryData,
  genreExclusiveOptions,
  typeScheduleOptions,
} from "@/types/diary"
import { validateRequest } from "@/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<
  NextResponse<{ diaries: DiaryData[]; total: number } | { error: string }>
> {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = (await params).facilityId
    const { searchParams } = request.nextUrl
    const page = parseInt(searchParams.get("page") || "1", 10)
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10)
    const search = searchParams.get("search") || ""
    const skip = (page - 1) * pageSize

    const [diaries, total] = await Promise.all([
      prisma.diary.findMany({
        where: {
          facilityId: id,
          name: {
            contains: search,
            mode: "insensitive",
          },
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
        },
        skip,
        take: pageSize,
      }),
      prisma.diary.count({
        where: {
          facilityId: id,
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      }),
    ])

    if (!diaries) {
      return NextResponse.json({ diaries: [], total: 0 })
    }

    const formattedDiaries: DiaryData[] = diaries.map((diary) => ({
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
        dayOfWeek: day.dayOfWeek || 0, 
        available: day.available,
        timeStart: day.timeStart,
        timeEnd: day.timeEnd,
      })),
    }))

    return NextResponse.json({ diaries: formattedDiaries, total })
  } catch (error) {
    console.error("Error fetching diaries:", error)
    return NextResponse.json(
      { error: "Error al cargar las actividades" },
      { status: 500 },
    )
  }
}
