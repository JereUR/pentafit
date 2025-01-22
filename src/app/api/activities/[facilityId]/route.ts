import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ActivityData } from "@/types/activity"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<
  NextResponse<
    { activities: ActivityData[]; total: number } | { error: string }
  >
> {
  try {
    const id = (await params).facilityId
    const { searchParams } = request.nextUrl
    const page = parseInt(searchParams.get("page") || "1", 10)
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10)
    const search = searchParams.get("search") || ""
    const skip = (page - 1) * pageSize

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
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
          description: true,
          price: true,
          isPublic: true,
          publicName: true,
          generateInvoice: true,
          maxSessions: true,
          mpAvailable: true,
          startDate: true,
          endDate: true,
          paymentType: true,
          activityType: true,
          facilityId: true,
        },
        skip,
        take: pageSize,
      }),
      prisma.activity.count({
        where: {
          facilityId: id,
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      }),
    ])

    if (!activities) {
      return NextResponse.json({ activities: [], total: 0 })
    }

    return NextResponse.json({ activities: activities, total })
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json(
      { error: "Error al cargar las actividades" },
      { status: 500 },
    )
  }
}
