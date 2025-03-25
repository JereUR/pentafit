import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ActivityData } from "@/types/activity"
import { validateRequest } from "@/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<NextResponse<{ activities: ActivityData[] } | { error: string }>> {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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
        staffMembers: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    })

    if (!activities) {
      return NextResponse.json({ activities: [], total: 0 })
    }

    const formattedActivities: ActivityData[] = activities.map((activity) => ({
      id: activity.id,
      name: activity.name,
      description: activity.description,
      price: activity.price,
      isPublic: activity.isPublic,
      publicName: activity.publicName,
      generateInvoice: activity.generateInvoice,
      maxSessions: activity.maxSessions,
      mpAvailable: activity.mpAvailable,
      startDate: activity.startDate,
      endDate: activity.endDate,
      paymentType: activity.paymentType,
      activityType: activity.activityType,
      facilityId: activity.facilityId,
      staffMembers: activity.staffMembers.map((staff) => ({
        id: staff.user.id,
        firstName: staff.user.firstName,
        lastName: staff.user.lastName,
        email: staff.user.email,
        avatarUrl: staff.user.avatarUrl,
      })),
    }))

    return NextResponse.json({ activities: formattedActivities })
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json(
      { error: "Error al cargar las actividades" },
      { status: 500 },
    )
  }
}
