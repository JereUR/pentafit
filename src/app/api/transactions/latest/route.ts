import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const facilityId = searchParams.get("facilityId")

    if (!facilityId) {
      return NextResponse.json(
        { error: "Facility ID is required" },
        { status: 400 },
      )
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        facilityId,
      },
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
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
      },
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Error fetching latest transactions:", error)
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 },
    )
  }
}
