import type React from "react"
import { Calendar, CalendarX, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface EmptyStateProps {
  icon: "workout" | "food" | "calendar"
  title: string
  description: string
  primaryColor: string
  showRedirectButton?: boolean
  href?: string
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  primaryColor,
  showRedirectButton = true,
  href,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      {icon === "workout" ? (
        <CalendarX className="h-10 w-10" style={{ color: primaryColor }} />
      ) : icon === "food" ? (
        <Utensils className="h-10 w-10" style={{ color: primaryColor }} />
      ) : (
        <Calendar className="h-10 w-10" style={{ color: primaryColor }} />
      )}
      <h2 className="text-2xl font-semibold mt-4">{title}</h2>
      <p className="text-muted-foreground text-sm mt-2">{description}</p>
      {showRedirectButton &&
        (href ? (
          <Button variant="outline" className="mt-4" asChild>
            <Link href={href}>
              {icon === "workout"
                ? "Ver todas las rutinas"
                : icon === "food"
                  ? "Ver todos los planes"
                  : "Ver todas las clases"}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" className="mt-4">
            {icon === "workout"
              ? "Ver todas las rutinas"
              : icon === "food"
                ? "Ver todos los planes"
                : "Ver todas las clases"}
          </Button>
        ))}
    </div>
  )
}

export default EmptyState
