import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ActivityExportData } from "@/types/activity"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<NextResponse<ActivityExportData[] | { error: string }>> {
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

    const formattedAllActivities: ActivityExportData[] = allActivities.map(
      (activity) => {
        return {
          name: activity.name,
          description: activity.description || "-",
          price: activity.price,
          isPublic: activity.isPublic ? "Si" : "No",
          publicName: activity.publicName || "-",
          generateInvoice: activity.generateInvoice ? "Si" : "No",
          maxSessions: activity.maxSessions,
          mpAvailable: activity.mpAvailable ? "Si" : "No",
          startDate: activity.startDate.toLocaleDateString(),
          endDate: activity.endDate.toLocaleDateString(),
          paymentType: activity.paymentType,
          activityType: activity.activityType,
        }
      },
    )

    return NextResponse.json(formattedAllActivities)
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json(
      { error: "Error al cargar las actividades" },
      { status: 500 },
    )
  }
}
