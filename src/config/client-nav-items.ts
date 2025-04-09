import {
  Home,
  Calendar,
  Dumbbell,
  LineChart,
  MessageSquare,
  FileText,
  Utensils,
} from "lucide-react"

import type { NavItem } from "@/types/sidebar"

export const clientNavItems: NavItem[] = [
  { title: "Inicio", icon: Home, href: "/inicio" },
  { title: "Mi Agenda", icon: Calendar, href: "/mi-agenda" },
  { title: "Mi Rutina", icon: Dumbbell, href: "/mi-rutina" },
  {
    title: "Mi Plan Nutricional",
    icon: Utensils,
    href: "/mi-plan-nutricional",
  },
  { title: "Mi Progreso", icon: LineChart, href: "/mi-progreso" },
  {
    title: "Comunicación",
    icon: MessageSquare,
    items: [
      { title: "Mensajes", href: "/comunicacion/mensajes" },
      { title: "Notificaciones", href: "/comunicacion/notificaciones" },
    ],
  },
  { title: "Pagos", icon: FileText, href: "/mis-pagos" },
]
