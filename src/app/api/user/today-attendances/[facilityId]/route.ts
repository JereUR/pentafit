import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'
import { validateRequest } from '@/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ facilityId: string }> }
) {
  try {
    const { dayAvailableIds } = await request.json()
    const { user } = await validateRequest()

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const attendances = await prisma.diaryAttendance.findMany({
      where: {
        userId: user.id,
        facilityId: (await params).facilityId,
        dayAvailableId: {
          in: dayAvailableIds
        },
        date: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    return NextResponse.json({ data: attendances })
  } catch (error) {
    console.error('Error fetching attendances:', error)
    return NextResponse.json(
      { error: 'Error al cargar las asistencias' },
      { status: 500 }
    )
  }
}