import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const workingFacility = await prisma.facility.findFirst({
      where: { isWorking: true },
      select: {
        id: true,
        name: true,
        logoUrl: true,
        isActive: true,
      },
    })

    if (!workingFacility) {
      return NextResponse.json(null)
    }

    return NextResponse.json(workingFacility)
  } catch (error) {
    console.error("Error fetching working facility:", error)
    return NextResponse.json(
      { error: "Failed to fetch working facility" },
      { status: 500 },
    )
  }
}
