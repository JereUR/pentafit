import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ facilityId: string }> },
) {
  try {
    const facilityId = (await params).facilityId

    const facility = await prisma.facility.findUnique({
      where: { id: facilityId },
      include: { metadata: true },
    })

    if (!facility) {
      return NextResponse.json({ error: "Facility not found" }, { status: 404 })
    }

    return NextResponse.json(facility)
  } catch (error) {
    console.error("Error fetching facility:", error)
    return NextResponse.json(
      { error: "Failed to fetch facility" },
      { status: 500 },
    )
  }
}
