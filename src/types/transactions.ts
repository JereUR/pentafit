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

export interface FacilityReference {
  id: string
  name: string
  logoUrl?: string
}

export interface TransactionDetails {
  attachmentId?: string
  attachmentName?: string
  replicatedId?: string
  replicatedName?: string

  targetFacilityId?: string
  targetFacilities?: Array<FacilityReference>

  sourceFacilityId?: string
  sourceId?: string
  sourceName?: string

  [key: string]: string | undefined | Array<FacilityReference> | null
}

export interface UserReference {
  id: string
  firstName: string
  lastName: string
  avatarUrl?: string
}

export interface EntityReference {
  id: string
  name: string
}

export interface Transaction {
  id: string
  type: TransactionType
  details?: TransactionDetails | null

  performedById: string
  performedBy: UserReference

  facilityId: string

  targetUserId?: string | null
  targetUser?: UserReference | null

  activityId?: string | null
  activity?: EntityReference | null
  planId?: string | null
  plan?: EntityReference | null
  diaryId?: string | null
  diary?: EntityReference | null
  routineId?: string | null
  routine?: EntityReference | null
  presetRoutineId?: string | null
  presetRoutine?: EntityReference | null

  createdAt: string
}
export type TransactionWithDetails = Transaction
