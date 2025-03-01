export enum TransactionType {
  ACTIVITY_CREATED = "ACTIVITY_CREATED",
  ACTIVITY_UPDATED = "ACTIVITY_UPDATED",
  ACTIVITY_DELETED = "ACTIVITY_DELETED",
  ACTIVITY_REPLICATED = "ACTIVITY_REPLICATED",
  STAFF_CREATED = "STAFF_CREATED",
  STAFF_UPDATED = "STAFF_UPDATED",
  STAFF_DELETED = "STAFF_DELETED",
  STAFF_ROLE_CHANGED = "STAFF_ROLE_CHANGED",
  CLIENT_CREATED = "CLIENT_CREATED",
  CLIENT_UPDATED = "CLIENT_UPDATED",
  CLIENT_DELETED = "CLIENT_DELETED",
  CLIENT_MEMBERSHIP_CHANGED = "CLIENT_MEMBERSHIP_CHANGED",
  PLAN_CREATED = "PLAN_CREATED",
  PLAN_UPDATED = "PLAN_UPDATED",
  PLAN_DELETED = "PLAN_DELETED",
  PLAN_REPLICATED = "PLAN_REPLICATED",
  DIARY_CREATED = "DIARY_CREATED",
  DIARY_UPDATED = "DIARY_UPDATED",
  DIARY_DELETED = "DIARY_DELETED",
  DIARY_REPLICATED = "DIARY_REPLICATED",
}

export interface TransactionDetails {
  attachmentName?: string
  [key: string]: string | undefined
}

export interface Transaction {
  id: string
  type: TransactionType
  details?: TransactionDetails | null
  performedById: string
  performedBy: {
    id: string
    firstName: string
    lastName: string
    avatarUrl?: string
  }
  facilityId: string
  targetUserId?: string | null
  targetUser?: {
    id: string
    firstName: string
    lastName: string
    avatarUrl?: string
  } | null
  activityId?: string | null
  activity?: {
    id: string
    name: string
  } | null
  planId?: string | null
  plan?: {
    id: string
    name: string
  } | null
  diaryId?: string | null
  diary?: {
    id: string
    name: string
  } | null
  createdAt: string
}
