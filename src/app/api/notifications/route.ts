import { NextRequest } from "next/server"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { notificationsInclude, NotificationsPage } from "@/types/notification"

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined

    const pageSize = 10

    const { user } = await validateRequest()

    if (!user) {
      return Response.json({ error: "No autorizado." }, { status: 401 })
    }

    const notifications = await prisma.notification.findMany({
      where: { recipientId: user.id },
      include: notificationsInclude,
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    })

    const nextCursor =
      notifications.length > pageSize ? notifications[pageSize].id : null

    const data: NotificationsPage = {
      notifications: notifications.slice(0, pageSize),
      nextCursor,
    }

    return Response.json(data)
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: "Error Interno del Servidor." },
      { status: 500 },
    )
  }
}
