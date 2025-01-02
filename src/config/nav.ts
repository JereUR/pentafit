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

import { NavItem } from "@/types/sidebar"

export const navItems: NavItem[] = [
  { title: "Inicio", icon: Home, href: "/panel-de-control" },
  { title: "Negocios", icon: Building2, href: "/negocios" },
  { title: "Equipo", icon: Users, href: "/equipo" },
  { title: "Agenda", icon: Calendar, href: "/agenda" },
  { title: "Actividades", icon: ClipboardList, href: "/actividades" },
  {
    title: "Facturación",
    icon: Receipt,
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
      { title: "Planes", href: "/entrenamiento/planes" },
    ],
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
