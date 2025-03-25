import { NextRequest, NextResponse } from "next/server"
import {
  ActivityExportData,
  formatStaffMembersForExport,
} from "@/types/activity"
import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ facilityId: string }> },
): Promise<NextResponse<ActivityExportData[] | { error: string }>> {
  try {
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = (await params).facilityId

    const allActivities = await prisma.activity.findMany({
      where: {
        facilityId: id,
      },
      include: {
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

    if (!allActivities) {
      return NextResponse.json([])
    }

    const formattedAllActivities: ActivityExportData[] = allActivities.map(
      (activity) => {
        const staffMembers = activity.staffMembers.map((staff) => ({
          id: staff.user.id,
          firstName: staff.user.firstName,
          lastName: staff.user.lastName,
          email: staff.user.email,
          avatarUrl: staff.user.avatarUrl,
        }))

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
          staffMembers: formatStaffMembersForExport(staffMembers),
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
