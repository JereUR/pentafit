import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ActivityData } from "@/types/activity"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<NextResponse<{ activities: ActivityData[] } | { error: string }>> {
  try {
    const id = (await params).facilityId

    const activities = await prisma.activity.findMany({
      where: {
        facilityId: id,
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
    })

    if (!activities) {
      return NextResponse.json({ activities: [], total: 0 })
    }

    return NextResponse.json({ activities: activities })
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json(
      { error: "Error al cargar las actividades" },
      { status: 500 },
    )
  }
}
