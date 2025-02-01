import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ActivityData } from "@/types/activity"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<NextResponse<ActivityData[] | { error: string }>> {
  try {
    const id = (await params).facilityId

    const allActivities = await prisma.activity.findMany({
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

    if (!allActivities) {
      return NextResponse.json([])
    }

    return NextResponse.json(allActivities)
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json(
      { error: "Error al cargar las actividades" },
      { status: 500 },
    )
  }
}
