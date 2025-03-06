import type { TransactionType, Prisma } from "@prisma/client"

export async function createTransaction({
  tx,
  type,
  details,
  performedById,
  facilityId,
  activityId,
  targetUserId,
  planId,
  diaryId,
}: {
  tx: Prisma.TransactionClient
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

    const transaction = await tx.transaction.create({
      data,
    })

    return transaction
  } catch (error) {
    console.error("Error creating transaction:", error)
    throw error
  }
}

export async function createActivityTransaction({
  tx,
  type,
  activityId,
  performedById,
  facilityId,
  details,
}: {
  tx: Prisma.TransactionClient
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
  const safeDetails = details && typeof details === "object" ? details : {}

  return createTransaction({
    tx,
    type,
    details: safeDetails,
    performedById,
    facilityId,
    activityId,
  })
}

export async function createStaffTransaction({
  tx,
  type,
  targetUserId,
  performedById,
  facilityId,
  details,
}: {
  tx: Prisma.TransactionClient
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
  const safeDetails = details && typeof details === "object" ? details : {}

  return createTransaction({
    tx,
    type,
    details: safeDetails,
    performedById,
    facilityId,
    targetUserId,
  })
}

export async function createClientTransaction({
  tx,
  type,
  targetUserId,
  performedById,
  facilityId,
  details,
}: {
  tx: Prisma.TransactionClient
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
  const safeDetails = details && typeof details === "object" ? details : {}

  return createTransaction({
    tx,
    type,
    details: safeDetails,
    performedById,
    facilityId,
    targetUserId,
  })
}

export async function createPlanTransaction({
  tx,
  type,
  planId,
  performedById,
  facilityId,
  details,
}: {
  tx: Prisma.TransactionClient
  type: "PLAN_CREATED" | "PLAN_UPDATED" | "PLAN_DELETED" | "PLAN_REPLICATED"
  planId: string
  performedById: string
  facilityId: string
  details?: Prisma.JsonValue
}) {
  const safeDetails = details && typeof details === "object" ? details : {}

  return createTransaction({
    tx,
    type,
    details: safeDetails,
    performedById,
    facilityId,
    planId,
  })
}

export async function createDiaryTransaction({
  tx,
  type,
  diaryId,
  performedById,
  facilityId,
  details,
}: {
  tx: Prisma.TransactionClient
  type: "DIARY_CREATED" | "DIARY_UPDATED" | "DIARY_DELETED" | "DIARY_REPLICATED"
  diaryId: string
  performedById: string
  facilityId: string
  details?: Prisma.JsonValue
}) {
  const safeDetails = details && typeof details === "object" ? details : {}

  return createTransaction({
    tx,
    type,
    details: safeDetails,
    performedById,
    facilityId,
    diaryId,
  })
}

export async function createRoutineTransaction({
  tx,
  type,
  routineId,
  performedById,
  facilityId,
  details,
}: {
  tx: Prisma.TransactionClient
  type:
    | "ROUTINE_CREATED"
    | "ROUTINE_UPDATED"
    | "ROUTINE_DELETED"
    | "ROUTINE_REPLICATED"
  routineId: string
  performedById: string
  facilityId: string
  details?: Prisma.JsonValue
}) {
  const safeDetails = details && typeof details === "object" ? details : {}

  return await tx.transaction.create({
    data: {
      type,
      routineId,
      performedById,
      facilityId,
      details: safeDetails,
    },
  })
}
