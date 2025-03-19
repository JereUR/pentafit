import type { NextRequest } from "next/server"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"

const ITEMS_PER_PAGE = 10

export async function GET(req: NextRequest) {
  try {
    const facilityId = req.nextUrl.searchParams.get("facilityId")
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined

    if (!facilityId) {
      return Response.json(
        { error: "Facility ID is required" },
        { status: 400 },
      )
    }

    const { user } = await validateRequest()

    if (!user) {
      return Response.json({ error: "No autorizado." }, { status: 401 })
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        facilityId,
      },
      take: ITEMS_PER_PAGE + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        type: true,
        details: true,
        createdAt: true,
        facilityId: true,
        performedById: true,
        targetUserId: true,
        activityId: true,
        planId: true,
        diaryId: true,
        routineId: true,
        presetRoutineId: true,
        performedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        targetUser: {
          select: {
            id: true,
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
      },
    })

    const nextCursor =
      transactions.length > ITEMS_PER_PAGE
        ? transactions[ITEMS_PER_PAGE].id
        : null

    return Response.json({
      transactions: transactions.slice(0, ITEMS_PER_PAGE),
      nextCursor,
    })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return Response.json(
      { error: "Error Interno del Servidor." },
      { status: 500 },
    )
  }
}
