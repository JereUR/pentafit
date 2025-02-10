import { type NotificationType, Prisma } from "@prisma/client"
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
  const notifications = facility.users.map((userFacility) => ({
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
            : "userId"]: relatedId,
    }),
  }))
  await tx.notification.createMany({ data: notifications })
}
