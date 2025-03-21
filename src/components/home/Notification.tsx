import {
  ArrowDownIcon as CalendarArrowDown,
  CalendarIcon as CalendarCog,
  CalendarPlus,
  CalendarX,
  ClipboardList,
  ClipboardPaste,
  ClipboardPen,
  ClipboardType,
  SquareActivity,
  UserCheck,
  UserRoundIcon as UserRoundPen,
  UserRoundPlus,
  UserRoundX,
  Utensils,
  UtensilsCrossed,
  Apple,
  Salad,
  Copy,
} from "lucide-react"
import Link from "next/link"
import type { JSX } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { PlanIcon } from "@/config/icons"
import { cn } from "@/lib/utils"
import type { NotificationData } from "@/types/notification"
import noImage from "@/assets/avatar-placeholder.png"
import type { NotificationType } from "@prisma/client"

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
    ROUTINE_CREATED: {
      message: "creó una rutina",
      icon: <SquareActivity className="h-4 w-4" />,
      href: `/entrenamiento/rutinas`,
      color: "text-green-500",
    },
    ROUTINE_UPDATED: {
      message: "editó una rutina",
      icon: <SquareActivity className="h-4 w-4" />,
      href: `/entrenamiento/rutinas`,
      color: "text-blue-500",
    },
    ROUTINE_DELETED: {
      message: "eliminó una rutina",
      icon: <SquareActivity className="h-4 w-4" />,
      href: `/entrenamiento/rutinas`,
      color: "text-red-500",
    },
    ROUTINE_REPLICATED: {
      message: "replicó rutinas",
      icon: <SquareActivity className="h-4 w-4" />,
      href: `/entrenamiento/rutinas`,
      color: "text-purple-500",
    },
    USER_CREATED: {
      message: "creó un usuario",
      icon: <UserRoundPlus className="h-4 w-4" />,
      href: `/equipo`,
      color: "text-green-500",
    },
    USER_UPDATED: {
      message: "editó un usuario",
      icon: <UserRoundPen className="h-4 w-4" />,
      href: `/equipo`,
      color: "text-blue-500",
    },
    USER_DELETED: {
      message: "eliminó un usuario",
      icon: <UserRoundX className="h-4 w-4" />,
      href: `/equipo`,
      color: "text-red-500",
    },
    PRESET_ROUTINE_CREATED: {
      message: "creó una rutina preestablecida",
      icon: <SquareActivity className="h-4 w-4" />,
      href: `/entrenamiento/rutinas-preestablecidas`,
      color: "text-green-500",
    },
    PRESET_ROUTINE_UPDATED: {
      message: "editó una rutina preestablecida",
      icon: <SquareActivity className="h-4 w-4" />,
      href: `/entrenamiento/rutinas-preestablecidas`,
      color: "text-blue-500",
    },
    PRESET_ROUTINE_DELETED: {
      message: "eliminó una rutina preestablecida",
      icon: <SquareActivity className="h-4 w-4" />,
      href: `/entrenamiento/rutinas-preestablecidas`,
      color: "text-red-500",
    },
    PRESET_ROUTINE_REPLICATED: {
      message: "replicó rutinas preestablecidas",
      icon: <SquareActivity className="h-4 w-4" />,
      href: `/entrenamiento/rutinas-preestablecidas`,
      color: "text-purple-500",
    },
    ASSIGN_ROUTINE_USER: {
      message: "asignó una rutina a un/os usuario/s",
      icon: <UserCheck className="h-4 w-4" />,
      href: `/entrenamiento/rutinas`,
      color: "text-blue-500",
    },
    UNASSIGN_ROUTINE_USER: {
      message: "desasignó una rutina de un/os usuario/s",
      icon: <UserRoundX className="h-4 w-4" />,
      href: `/entrenamiento/rutinas`,
      color: "text-red-500",
    },
    ROUTINE_CONVERTED_TO_PRESET: {
      message: "convirtió una rutina a preestablecida",
      icon: <Copy className="h-4 w-4" />,
      href: `/entrenamiento/rutinas-preestablecidas`,
      color: "text-purple-500",
    },
    NUTRITIONAL_PLAN_CREATED: {
      message: "creó un plan nutricional",
      icon: <Utensils className="h-4 w-4" />,
      href: `/entrenamiento/planes-nutricionales`,
      color: "text-green-500",
    },
    NUTRITIONAL_PLAN_UPDATED: {
      message: "editó un plan nutricional",
      icon: <Utensils className="h-4 w-4" />,
      href: `/entrenamiento/planes-nutricionales`,
      color: "text-blue-500",
    },
    NUTRITIONAL_PLAN_DELETED: {
      message: "eliminó un plan nutricional",
      icon: <UtensilsCrossed className="h-4 w-4" />,
      href: `/entrenamiento/planes-nutricionales`,
      color: "text-red-500",
    },
    NUTRITIONAL_PLAN_REPLICATED: {
      message: "replicó planes nutricionales",
      icon: <Copy className="h-4 w-4" />,
      href: `/entrenamiento/planes-nutricionales`,
      color: "text-purple-500",
    },
    PRESET_NUTRITIONAL_PLAN_CREATED: {
      message: "creó un plan nutricional preestablecido",
      icon: <Apple className="h-4 w-4" />,
      href: `/entrenamiento/planes-nutricionales-preestablecidos`,
      color: "text-green-500",
    },
    PRESET_NUTRITIONAL_PLAN_UPDATED: {
      message: "editó un plan nutricional preestablecido",
      icon: <Apple className="h-4 w-4" />,
      href: `/entrenamiento/planes-nutricionales-preestablecidos`,
      color: "text-blue-500",
    },
    PRESET_NUTRITIONAL_PLAN_DELETED: {
      message: "eliminó un plan nutricional preestablecido",
      icon: <UtensilsCrossed className="h-4 w-4" />,
      href: `/entrenamiento/planes-nutricionales-preestablecidos`,
      color: "text-red-500",
    },
    PRESET_NUTRITIONAL_PLAN_REPLICATED: {
      message: "replicó planes nutricionales preestablecidos",
      icon: <Salad className="h-4 w-4" />,
      href: `/entrenamiento/planes-nutricionales-preestablecidos`,
      color: "text-purple-500",
    },
    NUTRITIONAL_PLAN_CONVERTED_TO_PRESET: {
      message: "convirtió un plan nutricional a preestablecido",
      icon: <Copy className="h-4 w-4" />,
      href: `/entrenamiento/planes-nutricionales-preestablecidos`,
      color: "text-purple-500",
    },
    ASSIGN_NUTRITIONAL_PLAN_USER: {
      message: "asignó un plan nutricional a un/os usuario/s",
      icon: <UserCheck className="h-4 w-4" />,
      href: `/entrenamiento/planes-nutricionales`,
      color: "text-blue-500",
    },
    UNASSIGN_NUTRITIONAL_PLAN_USER: {
      message: "desasignó un plan nutricional de un/os usuario/s",
      icon: <UserRoundX className="h-4 w-4" />,
      href: `/entrenamiento/planes-nutricionales`,
      color: "text-red-500",
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
          {(notification.activity ||
            notification.plan ||
            notification.diary ||
            notification.routine ||
            notification.presetRoutine ||
            notification.nutritionalPlan ||
            notification.presetNutritionalPlan) && (
              <p className="mt-1 text-xs text-muted-foreground">
                {notification.activity?.name ||
                  notification.plan?.name ||
                  notification.diary?.name ||
                  notification.routine?.name ||
                  notification.presetRoutine?.name ||
                  notification.nutritionalPlan?.name ||
                  notification.presetNutritionalPlan?.name}
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

