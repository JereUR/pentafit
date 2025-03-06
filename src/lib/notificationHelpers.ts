import type { NotificationType, Prisma } from "@prisma/client"

export async function createNotification(
  tx: Prisma.TransactionClient,
  issuerId: string,
  facilityId: string,
  type: NotificationType,
  relatedId?: string,
) {
  const facility = await tx.facility.findUnique({
    where: { id: facilityId },
    include: { users: true },
  })
  if (!facility) throw new Error("Facility not found")

  const recipientUsers = facility.users.filter(
    (userFacility) => userFacility.userId !== issuerId,
  )

  const notifications = recipientUsers.map((userFacility) => ({
    recipientId: userFacility.userId,
    issuerId,
    facilityId,
    type,
    ...(relatedId && {
      [type.toLowerCase().includes("activity")
        ? "activityId"
        : type.toLowerCase().includes("plan")
          ? "planId"
          : type.toLowerCase().includes("diary")
            ? "diaryId"
            : type.toLowerCase().includes("routine")
              ? "routineId"
              : "userId"]: relatedId,
    }),
  }))

  if (notifications.length > 0) {
    await tx.notification.createMany({ data: notifications })
  }
}
