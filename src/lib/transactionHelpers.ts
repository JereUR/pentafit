import prisma from "./prisma"
import type { TransactionType, Prisma } from "@prisma/client"

export async function createTransaction({
  type,
  details,
  performedById,
  facilityId,
  activityId,
  targetUserId,
  planId,
  diaryId,
}: {
  type: TransactionType
  details?: Prisma.JsonValue
  performedById: string
  facilityId: string
  activityId?: string
  targetUserId?: string
  planId?: string
  diaryId?: string
}) {
  try {
    const safeDetails = details && typeof details === "object" ? details : {}

    const data = {
      type,
      details: safeDetails,
      performedById,
      facilityId,
      ...(activityId && { activityId }),
      ...(targetUserId && { targetUserId }),
      ...(planId && { planId }),
      ...(diaryId && { diaryId }),
    }

    console.log("Final transaction data:", JSON.stringify(data, null, 2))

    const transaction = await prisma.transaction.create({
      data,
    })

    return transaction
  } catch (error) {
    console.error("Error creating transaction:", error)
    throw error
  }
}

export async function createActivityTransaction({
  type,
  activityId,
  performedById,
  facilityId,
  details,
}: {
  type:
    | "ACTIVITY_CREATED"
    | "ACTIVITY_UPDATED"
    | "ACTIVITY_DELETED"
    | "ACTIVITY_REPLICATED"
  activityId: string
  performedById: string
  facilityId: string
  details?: Prisma.JsonValue
}) {
  const jsonDetails = details
    ? JSON.parse(
        JSON.stringify(details, (_, value) =>
          value === undefined ? null : value,
        ),
      )
    : undefined

  console.log("Processed details:", JSON.stringify(jsonDetails, null, 2))

  return createTransaction({
    type,
    performedById,
    facilityId,
    activityId,
  })
}

export async function createStaffTransaction({
  type,
  targetUserId,
  performedById,
  facilityId,
  details,
}: {
  type:
    | "STAFF_CREATED"
    | "STAFF_UPDATED"
    | "STAFF_DELETED"
    | "STAFF_ROLE_CHANGED"
  targetUserId: string
  performedById: string
  facilityId: string
  details?: Prisma.JsonValue
}) {
  const safeDetails = details || {}

  return createTransaction({
    type,
    details: safeDetails,
    performedById,
    facilityId,
    targetUserId,
  })
}

export async function createClientTransaction({
  type,
  targetUserId,
  performedById,
  facilityId,
  details,
}: {
  type:
    | "CLIENT_CREATED"
    | "CLIENT_UPDATED"
    | "CLIENT_DELETED"
    | "CLIENT_MEMBERSHIP_CHANGED"
  targetUserId: string
  performedById: string
  facilityId: string
  details?: Prisma.JsonValue
}) {
  const safeDetails = details || undefined

  return createTransaction({
    type,
    details: safeDetails,
    performedById,
    facilityId,
    targetUserId,
  })
}

export async function createPlanTransaction({
  type,
  planId,
  performedById,
  facilityId,
  details,
}: {
  type: "PLAN_CREATED" | "PLAN_UPDATED" | "PLAN_DELETED" | "PLAN_REPLICATED"
  planId: string
  performedById: string
  facilityId: string
  details?: Prisma.JsonValue
}) {
  const safeDetails = details || {}

  return createTransaction({
    type,
    details: safeDetails,
    performedById,
    facilityId,
    planId,
  })
}

export async function createDiaryTransaction({
  type,
  diaryId,
  performedById,
  facilityId,
  details,
}: {
  type: "DIARY_CREATED" | "DIARY_UPDATED" | "DIARY_DELETED" | "DIARY_REPLICATED"
  diaryId: string
  performedById: string
  facilityId: string
  details?: Prisma.JsonValue
}) {
  const safeDetails = details || {}

  return createTransaction({
    type,
    details: safeDetails,
    performedById,
    facilityId,
    diaryId,
  })
}
