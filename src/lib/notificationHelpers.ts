import { type Prisma, Role, type NotificationType } from "@prisma/client"
import { getRelatedIdField } from "./utils"
import { NotificationInputData } from "@/types/notification"

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

  if (!facility) {
    console.error("Facility not found:", facilityId)
    throw new Error("Facility not found")
  }

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

  const notifications: NotificationInputData[] = recipientUsers.map(
    (userFacility) => {
      const notificationData: NotificationInputData = {
        recipientId: userFacility.userId,
        issuerId,
        facilityId,
        type,
        read: false,
      }

      if (relatedId && typeof relatedId === "string") {
        const relatedField = getRelatedIdField(type)
        notificationData[relatedField] = relatedId
      }

      return notificationData
    },
  )

  if (notifications.length > 0) {
    try {
      await tx.notification.createMany({ data: notifications })
    } catch (error) {
      console.error("Error in tx.notification.createMany:", error, { notifications })
      throw error
    }
  }
}