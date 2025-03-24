import {
  Home,
  Building2,
  Users,
  Calendar,
  ClipboardList,
  Receipt,
  LineChart,
  Dumbbell,
  MessageSquare,
} from "lucide-react"

import type { NavItem } from "@/types/sidebar"
import { Role } from "@prisma/client"
import { PlanIcon } from "./icons"

export const adminNavItems: NavItem[] = [
  { title: "Inicio", icon: Home, href: "/panel-de-control" },
  {
    title: "Establecimientos",
    icon: Building2,
    href: "/establecimientos",
    roles: [Role.SUPER_ADMIN],
  },
  {
    title: "Equipo",
    icon: Users,
    href: "/equipo",
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  },
  {
    title: "Planes",
    icon: PlanIcon,
    href: "/planes",
    roles: [Role.SUPER_ADMIN],
  },
  {
    title: "Agenda",
    icon: Calendar,
    href: "/agenda",
    roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.STAFF],
  },
  {
    title: "Actividades",
    icon: ClipboardList,
    href: "/actividades",
    roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.STAFF],
  },
  {
    title: "Facturación",
    icon: Receipt,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
    items: [
      { title: "Facturas", href: "/facturacion/facturas" },
      { title: "Pagos", href: "/facturacion/pagos" },
    ],
  },
  { title: "Seguimiento", icon: LineChart, href: "/seguimiento" },
  {
    title: "Entrenamiento",
    icon: Dumbbell,
    items: [
      { title: "Rutinas", href: "/entrenamiento/rutinas" },
      {
        title: "Rutinas preestablecidas",
        href: "/entrenamiento/rutinas-preestablecidas",
      },
      {
        title: "Planes nutricionales",
        href: "/entrenamiento/planes-nutricionales",
      },
      {
        title: "Planes nutricionales preestablecidos",
        href: "/entrenamiento/planes-nutricionales-preestablecidos",
      },
    ],
    roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.STAFF],
  },
  {
    title: "Comunicación",
    icon: MessageSquare,
    items: [
      { title: "Mensajes", href: "/comunicacion/mensajes" },
      { title: "Notificaciones", href: "/comunicacion/notificaciones" },
    ],
  },
]
