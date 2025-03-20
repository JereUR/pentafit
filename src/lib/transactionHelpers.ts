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
  routineId,
  presetRoutineId,
  nutritionalPlanId,
  presetNutritionalPlanId,
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
  routineId?: string
  presetRoutineId?: string
  nutritionalPlanId?: string
  presetNutritionalPlanId?: string
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
      ...(routineId && { routineId }),
      ...(presetRoutineId && { presetRoutineId }),
      ...(nutritionalPlanId && { nutritionalPlanId }),
      ...(presetNutritionalPlanId && { presetNutritionalPlanId }),
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
    | "ASSIGN_ROUTINE_USER"
    | "UNASSIGN_ROUTINE_USER"
    | "ROUTINE_CONVERTED_TO_PRESET"
  routineId: string
  performedById: string
  facilityId: string
  details?: Prisma.JsonValue
}) {
  const safeDetails = details && typeof details === "object" ? details : {}

  return await createTransaction({
    tx,
    type,
    details: safeDetails,
    performedById,
    facilityId,
    routineId,
  })
}

export async function createPresetRoutineTransaction({
  tx,
  type,
  presetRoutineId,
  performedById,
  facilityId,
  details,
}: {
  tx: Prisma.TransactionClient
  type:
    | "PRESET_ROUTINE_CREATED"
    | "PRESET_ROUTINE_UPDATED"
    | "PRESET_ROUTINE_DELETED"
    | "PRESET_ROUTINE_REPLICATED"
  presetRoutineId: string
  performedById: string
  facilityId: string
  details?: Prisma.JsonValue
}) {
  const safeDetails = details && typeof details === "object" ? details : {}

  return await createTransaction({
    tx,
    type,
    details: safeDetails,
    performedById,
    facilityId,
    presetRoutineId,
  })
}

export async function createNutritionalPlanTransaction({
  tx,
  type,
  nutritionalPlanId,
  performedById,
  facilityId,
  details,
}: {
  tx: Prisma.TransactionClient
  type:
    | "NUTRITIONAL_PLAN_CREATED"
    | "NUTRITIONAL_PLAN_UPDATED"
    | "NUTRITIONAL_PLAN_DELETED"
    | "NUTRITIONAL_PLAN_REPLICATED"
    | "NUTRITIONAL_PLAN_ASSIGNED"
  nutritionalPlanId: string
  performedById: string
  facilityId: string
  details?: Prisma.JsonValue
}) {
  const safeDetails = details && typeof details === "object" ? details : {}

  return await createTransaction({
    tx,
    type,
    details: safeDetails,
    performedById,
    facilityId,
    nutritionalPlanId,
  })
}

export async function createPresetNutritionalPlanTransaction({
  tx,
  type,
  presetNutritionalPlanId,
  performedById,
  facilityId,
  details,
}: {
  tx: Prisma.TransactionClient
  type:
    | "PRESET_NUTRITIONAL_PLAN_CREATED"
    | "PRESET_NUTRITIONAL_PLAN_UPDATED"
    | "PRESET_NUTRITIONAL_PLAN_DELETED"
    | "PRESET_NUTRITIONAL_PLAN_REPLICATED"
  presetNutritionalPlanId: string
  performedById: string
  facilityId: string
  details?: Prisma.JsonValue
}) {
  const safeDetails = details && typeof details === "object" ? details : {}

  return await createTransaction({
    tx,
    type,
    details: safeDetails,
    performedById,
    facilityId,
    presetNutritionalPlanId,
  })
}
