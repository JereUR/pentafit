import { type Prisma, Role, type NotificationType } from "@prisma/client"

export async function createNotification({
  tx,
  issuerId,
  facilityId,
  type,
  relatedId,
  assignedUsers,
}: {
  tx: Prisma.TransactionClient
  issuerId: string
  facilityId: string
  type: NotificationType
  relatedId?: string
  assignedUsers?: string[]
}) {
  const facility = await tx.facility.findUnique({
    where: { id: facilityId },
    include: {
      users: {
        include: {
          user: {
            select: {
              id: true,
              role: true,
            },
          },
        },
      },
    },
  })

  if (!facility) throw new Error("Facility not found")

  let recipientUsers = facility.users.filter(
    (userFacility) =>
      userFacility.user.role !== Role.CLIENT &&
      userFacility.user.id !== issuerId,
  )

  if (
    type === "USER_CREATED" ||
    type === "USER_UPDATED" ||
    type === "USER_DELETED"
  ) {
    recipientUsers = recipientUsers.filter(
      (userFacility) =>
        userFacility.user.role === Role.ADMIN ||
        userFacility.user.role === Role.SUPER_ADMIN,
    )
  }

  if (assignedUsers && assignedUsers.length > 0) {
    const assignedFacilityUsers = facility.users.filter(
      (userFacility) =>
        assignedUsers.includes(userFacility.userId) &&
        userFacility.userId !== issuerId &&
        !recipientUsers.some(
          (recipient) => recipient.userId === userFacility.userId,
        ),
    )

    recipientUsers = [...recipientUsers, ...assignedFacilityUsers]
  }

  const notifications = recipientUsers.map((userFacility) => ({
    recipientId: userFacility.userId,
    issuerId,
    facilityId,
    type,
    ...(relatedId && {
      [type.toLowerCase().includes("activity")
        ? "activityId"
        : type.toLowerCase().includes("plan") &&
            !type.toLowerCase().includes("nutritional")
          ? "planId"
          : type.toLowerCase().includes("diary")
            ? "diaryId"
            : type.toLowerCase().startsWith("routine") ||
                type.toLowerCase().startsWith("assign_routine") ||
                type.toLowerCase().startsWith("unassign_routine")
              ? "routineId"
              : type.toLowerCase().startsWith("preset_routine")
                ? "presetRoutineId"
                : type.toLowerCase().startsWith("nutritional_plan") ||
                    type.toLowerCase().startsWith("assign_nutritional_plan") ||
                    type.toLowerCase().startsWith("unassign_nutritional_plan")
                  ? "nutritionalPlanId"
                  : type.toLowerCase().startsWith("preset_nutritional_plan")
                    ? "presetNutritionalPlanId"
                    : "userId"]: relatedId,
    }),
  }))

  if (notifications.length > 0) {
    await tx.notification.createMany({ data: notifications })
  }
}
