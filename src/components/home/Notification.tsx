import {
  ArrowDownIcon as CalendarArrowDown,
  CalendarIcon as CalendarCog,
  CalendarPlus,
  CalendarX,
  ClipboardList,
  ClipboardPaste,
  ClipboardPen,
  ClipboardType,
} from "lucide-react"
import Link from "next/link"
import type { JSX } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { PlanIcon } from "@/config/icons"
import { cn } from "@/lib/utils"
import type { NotificationData } from "@/types/notification"
import type { NotificationType } from "@prisma/client"
import noImage from '@/assets/avatar-placeholder.png'

interface NotificationProps {
  notification: NotificationData
}

export default function Notification({ notification }: NotificationProps) {
  const notificationTypeMap: Record<
    NotificationType,
    { message: string; icon: JSX.Element; href: string; color: string }
  > = {
    ACTIVITY_CREATED: {
      message: "creó una actividad",
      icon: <ClipboardList className="h-4 w-4" />,
      href: `/actividades`,
      color: "text-green-500",
    },
    ACTIVITY_UPDATED: {
      message: "editó una actividad",
      icon: <ClipboardPen className="h-4 w-4" />,
      href: `/actividades`,
      color: "text-blue-500",
    },
    ACTIVITY_DELETED: {
      message: "eliminó una actividad",
      icon: <ClipboardType className="h-4 w-4" />,
      href: `/actividades`,
      color: "text-red-500",
    },
    ACTIVITY_REPLICATED: {
      message: "replicó actividades",
      icon: <ClipboardPaste className="h-4 w-4" />,
      href: `/actividades`,
      color: "text-purple-500",
    },
    PLAN_CREATED: {
      message: "creó un plan",
      icon: <PlanIcon className="h-4 w-4" />,
      href: `/planes`,
      color: "text-green-500",
    },
    PLAN_UPDATED: {
      message: "editó un plan",
      icon: <PlanIcon className="h-4 w-4" />,
      href: `/planes`,
      color: "text-blue-500",
    },
    PLAN_DELETED: {
      message: "eliminó un plan",
      icon: <PlanIcon className="h-4 w-4" />,
      href: `/planes`,
      color: "text-red-500",
    },
    PLAN_REPLICATED: {
      message: "replicó planes",
      icon: <PlanIcon className="h-4 w-4" />,
      href: `/planes`,
      color: "text-purple-500",
    },
    DIARY_CREATED: {
      message: "creó una agenda",
      icon: <CalendarPlus className="h-4 w-4" />,
      href: `/agenda`,
      color: "text-green-500",
    },
    DIARY_UPDATED: {
      message: "editó una agenda",
      icon: <CalendarCog className="h-4 w-4" />,
      href: `/agenda`,
      color: "text-blue-500",
    },
    DIARY_DELETED: {
      message: "eliminó una agenda",
      icon: <CalendarX className="h-4 w-4" />,
      href: `/agenda`,
      color: "text-red-500",
    },
    DIARY_REPLICATED: {
      message: "replicó agendas",
      icon: <CalendarArrowDown className="h-4 w-4" />,
      href: `/agenda`,
      color: "text-purple-500",
    },
  }

  const { message, icon, href, color } = notificationTypeMap[notification.type]

  return (
    <Link href={href} className="block">
      <Card
        className={cn(
          "flex items-center gap-4 p-4 transition-all hover:shadow-md",
          !notification.read && "bg-primary/5",
        )}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={notification.issuer.avatarUrl || noImage.src}
            alt={`${notification.issuer.firstName} ${notification.issuer.lastName}`}
          />
          <AvatarFallback>
            {notification.issuer.firstName[0]}
            {notification.issuer.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <p className="text-sm font-medium">
            <span className="font-semibold">
              {notification.issuer.firstName} {notification.issuer.lastName}
            </span>{" "}
            {message}
          </p>
          {(notification.activity || notification.plan || notification.diary) && (
            <p className="mt-1 text-xs text-muted-foreground">
              {notification.activity?.name || notification.plan?.name || notification.diary?.name}
            </p>
          )}
        </div>
        <Badge variant="outline" className={cn("ml-auto", color)}>
          {icon}
        </Badge>
      </Card>
    </Link>
  )
}

