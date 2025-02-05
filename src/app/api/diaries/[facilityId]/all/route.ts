import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import {
  DiaryExportData,
  formatDaysAvailable,
  formatOfferDays,
} from "@/types/diary"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<NextResponse<DiaryExportData[] | { error: string }>> {
  try {
    const id = (await params).facilityId

    const allDiaries = await prisma.diary.findMany({
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
      },
    })

    if (!allDiaries) {
      return NextResponse.json([])
    }

    const formattedAllDiaries: DiaryExportData[] = allDiaries.map((d) => ({
      name: d.name,
      typeSchedule: d.typeSchedule,
      dateFrom: d.dateFrom.toISOString().split("T")[0],
      dateUntil: d.dateUntil.toISOString().split("T")[0],
      repeatFor: d.repeatFor ? d.repeatFor.toString() : "-",
      offerDays: formatOfferDays(d.offerDays),
      termDuration: d.termDuration,
      amountOfPeople: d.amountOfPeople,
      isActive: d.isActive ? "Si" : "No",
      genreExclusive: d.genreExclusive ? "Si" : "No",
      worksHolidays: d.worksHolidays ? "Si" : "No",
      observations: d.observations || "-",
      daysAvailable: formatDaysAvailable(d.daysAvailable),
    }))

    return NextResponse.json(formattedAllDiaries)
  } catch (error) {
    console.error("Error fetching diaries:", error)
    return NextResponse.json(
      { error: "Error al cargar las actividades" },
      { status: 500 },
    )
  }
}
