import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ActivityData } from "@/types/activity"
import { validateRequest } from "@/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<
  NextResponse<
    { activities: ActivityData[]; total: number } | { error: string }
  >
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

    return NextResponse.json({ activities: formattedActivities, total })
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json(
      { error: "Error al cargar las actividades" },
      { status: 500 },
    )
  }
}
