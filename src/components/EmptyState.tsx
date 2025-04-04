import { CalendarX, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title: string
  description: string
  icon: "workout" | "food"
  primaryColor: string
  showRedirectButton?: boolean
}

export function EmptyState({ title, description, icon, primaryColor, showRedirectButton = true }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="flex h-20 w-20 items-center justify-center bg-card rounded-full">
        {icon === "workout" ? (
          <CalendarX className="h-10 w-10" style={{ color: primaryColor }} />
        ) : (
          <Utensils className="h-10 w-10" style={{ color: primaryColor }} />
        )}
      </div>
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>
      {showRedirectButton && <Button variant="outline" className="mt-4">
        {icon === "workout" ? "Ver todas las rutinas" : "Ver todos los planes"}
      </Button>}
    </div>
  )
}

