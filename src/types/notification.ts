import { NotificationType, Prisma } from "@prisma/client"

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
  routine: {
    select: {
      id: true,
      name: true,
    },
  },
  presetRoutine: {
    select: {
      id: true,
      name: true,
    },
  },
  nutritionalPlan: {
    select: {
      id: true,
      name: true,
    },
  },
  presetNutritionalPlan: {
    select: {
      id: true,
      name: true,
    },
  },
  user: {
    select: {
      firstName: true,
      lastName: true,
    },
  },
  invoice: {
    select: {
      id: true,
      user:{
        select: {
          firstName: true,
          lastName: true,
        },
      }
    },
  },
  payment:{
    select: {
      id: true,
      user:{
        select: {
          firstName: true,
          lastName: true,
        },
      }
    },
  }
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

export type NotificationRelatedField =
  | "activityId"
  | "planId"
  | "diaryId"
  | "routineId"
  | "presetRoutineId"
  | "nutritionalPlanId"
  | "presetNutritionalPlanId"
  | "invoiceId"
  | "paymentId"
  | "userId"

  export interface NotificationInputData {
    recipientId: string
    issuerId: string
    facilityId: string
    type: NotificationType
    message?: string
    read: boolean
    activityId?: string
    planId?: string
    diaryId?: string
    routineId?: string
    presetRoutineId?: string
    nutritionalPlanId?: string
    presetNutritionalPlanId?: string
    invoiceId?: string
    paymentId?: string
    userId?: string
  }

  export interface ClientNotificationDetails{
    recipientId: string
    issuerId: string
    facilityId: string
    type: NotificationType
    relatedId?: string
    entityName?: string
    startDate?: Date
    endDate?: Date
    changeDetails?: string[]
    replacedEntityName?: string
  }