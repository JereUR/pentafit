import type { NotificationType, Prisma } from "@prisma/client"

export async function createNotification(
  tx: Prisma.TransactionClient,
  issuerId: string,
  facilityId: string | string[],
  type: NotificationType,
  relatedId?: string,
) {
  const facilityIds = Array.isArray(facilityId) ? facilityId : [facilityId]

  const facilities = await tx.facility.findMany({
    where: { id: { in: facilityIds } },
    include: { users: true },
  })

  if (facilities.length === 0) throw new Error("No facilities found")

  const notifications = facilities.flatMap((facility) =>
    facility.users
      .filter((userFacility) => userFacility.userId !== issuerId)
      .map((userFacility) => ({
        recipientId: userFacility.userId,
        issuerId,
        facilityId: facility.id,
        type,
        ...(relatedId && {
          [type.toLowerCase().includes("activity")
            ? "activityId"
            : type.toLowerCase().includes("plan")
              ? "planId"
              : type.toLowerCase().includes("diary")
                ? "diaryId"
                : "userId"]: relatedId,
        }),
      })),
  )

  if (notifications.length > 0) {
    await tx.notification.createMany({ data: notifications })
  }
}

