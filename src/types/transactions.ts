import { UserClient } from "./user"

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
  ASSIGN_PLAN_USER = "ASSIGN_PLAN_USER",
  UNASSIGN_PLAN_USER = "UNASSIGN_PLAN_USER",
  DIARY_CREATED = "DIARY_CREATED",
  DIARY_UPDATED = "DIARY_UPDATED",
  DIARY_DELETED = "DIARY_DELETED",
  DIARY_REPLICATED = "DIARY_REPLICATED",
  ROUTINE_CREATED = "ROUTINE_CREATED",
  ROUTINE_UPDATED = "ROUTINE_UPDATED",
  ROUTINE_DELETED = "ROUTINE_DELETED",
  ROUTINE_REPLICATED = "ROUTINE_REPLICATED",
  ROUTINE_CONVERTED_TO_PRESET = "ROUTINE_CONVERTED_TO_PRESET",
  PRESET_ROUTINE_CREATED = "PRESET_ROUTINE_CREATED",
  PRESET_ROUTINE_UPDATED = "PRESET_ROUTINE_UPDATED",
  PRESET_ROUTINE_DELETED = "PRESET_ROUTINE_DELETED",
  PRESET_ROUTINE_REPLICATED = "PRESET_ROUTINE_REPLICATED",
  ASSIGN_ROUTINE_USER = "ASSIGN_ROUTINE_USER",
  UNASSIGN_ROUTINE_USER = "UNASSIGN_ROUTINE_USER",
  NUTRITIONAL_PLAN_CREATED = "NUTRITIONAL_PLAN_CREATED",
  NUTRITIONAL_PLAN_UPDATED = "NUTRITIONAL_PLAN_UPDATED",
  NUTRITIONAL_PLAN_DELETED = "NUTRITIONAL_PLAN_DELETED",
  NUTRITIONAL_PLAN_REPLICATED = "NUTRITIONAL_PLAN_REPLICATED",
  NUTRITIONAL_PLAN_CONVERTED_TO_PRESET = "NUTRITIONAL_PLAN_CONVERTED_TO_PRESET",
  ASSIGN_NUTRITIONAL_PLAN_USER = "ASSIGN_NUTRITIONAL_PLAN_USER",
  UNASSIGN_NUTRITIONAL_PLAN_USER = "UNASSIGN_NUTRITIONAL_PLAN_USER",
  PRESET_NUTRITIONAL_PLAN_CREATED = "PRESET_NUTRITIONAL_PLAN_CREATED",
  PRESET_NUTRITIONAL_PLAN_UPDATED = "PRESET_NUTRITIONAL_PLAN_UPDATED",
  PRESET_NUTRITIONAL_PLAN_DELETED = "PRESET_NUTRITIONAL_PLAN_DELETED",
  PRESET_NUTRITIONAL_PLAN_REPLICATED = "PRESET_NUTRITIONAL_PLAN_REPLICATED",
  INVOICE_CREATED = "INVOICE_CREATED",
  INVOICE_UPDATED = "INVOICE_UPDATED",
  INVOICE_DELETED = "INVOICE_DELETED",
  PAYMENT_CREATED = "PAYMENT_CREATED",
  PAYMENT_UPDATED = "PAYMENT_UPDATED",
  PAYMENT_DELETED = "PAYMENT_DELETED",
}

export interface FacilityReference {
  id: string
  name: string
  logoUrl?: string
}

export interface UserReference {
  id: string
  firstName: string
  lastName: string
  avatarUrl?: string
}

export interface EntityReferenceWithUser{
  id:string,
  user:{
    firstName:string,
    lastName:string,
  }
}

export interface EntityReference {
  id: string
  name: string
}

export interface TransactionDetails {
  action?: string
  attachmentId?: string
  attachmentName?: string
  replicatedId?: string
  replicatedName?: string

  targetFacilityId?: string
  targetFacilities?: Array<FacilityReference>

  sourceFacilityId?: string
  sourceId?: string
  sourceName?: string

  assignedUsers?: Array<UserClient>
  assignedCount?: number
  alreadyAssignedCount?: number

  unassignedUsers?: Array<UserClient>
  unassignedCount?: number

  presetRoutineId?: string
  presetRoutineName?: string

  presetNutritionalPlanId?: string
  presetNutritionalPlanName?: string

  [key: string]:
    | string
    | Array<UserClient>
    | Array<FacilityReference>
    | number
    | undefined
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
  nutritionalPlanId?: string | null
  nutritionalPlan?: EntityReference | null
  presetNutritionalPlanId?: string | null
  presetNutritionalPlan?: EntityReference | null
  invoiceId?: string | null
  invoice?: EntityReferenceWithUser | null
  paymentId?: string | null
  payment?: EntityReferenceWithUser | null

  createdAt: string
}

export interface TransactionWithDetails extends Transaction {
  details: TransactionDetails
}
