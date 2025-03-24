import {
  Home,
  User,
  Calendar,
  Dumbbell,
  LineChart,
  MessageSquare,
  FileText,
} from "lucide-react"

import type { NavItem } from "@/types/sidebar"

export const clientNavItems: NavItem[] = [
  { title: "Inicio", icon: Home, href: "/inicio" },
  { title: "Mi Perfil", icon: User, href: "/perfil" },
  { title: "Mi Agenda", icon: Calendar, href: "/mi-agenda" },
  {
    title: "Mis Entrenamientos",
    icon: Dumbbell,
    items: [
      { title: "Rutinas", href: "/mis-entrenamientos/rutinas" },
      {
        title: "Plan Nutricional",
        href: "/mis-entrenamientos/plan-nutricional",
      },
    ],
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
