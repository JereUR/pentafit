import { Prisma } from "@prisma/client"

export const notificationsInclude = {
  issuer: {
    select: {
      firstName: true,
      lastName: true,
      avatarUrl: true,
    },
  },
  activity: {
    select: {
      id: true,
      name: true,
    },
  },
  plan: {
    select: {
      id: true,
      name: true,
    },
  },
  diary: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.NotificationInclude

export type NotificationData = Prisma.NotificationGetPayload<{
  include: typeof notificationsInclude
}>

export interface NotificationsPage {
  notifications: NotificationData[]
  nextCursor: string | null
}

export interface NotificationCountInfo {
  unreadCount: number
}
