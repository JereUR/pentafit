import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { AllDIaryData } from "@/types/diary"

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
      daysAvailable: diary.daysAvailable.map((day) => day.available),
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
