import { Calendar, CalendarX, Utensils, CreditCard, FileText } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon: "workout" | "food" | "calendar" | "payment" | "invoice"
  title: string
  description: string
  primaryColor: string
  showRedirectButton?: boolean
  href?: string
  buttonText?: string
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  primaryColor,
  showRedirectButton = true,
  href,
  buttonText,
}) => {
  const getIcon = () => {
    switch (icon) {
      case "workout":
        return <CalendarX className="h-10 w-10" style={{ color: primaryColor }} />
      case "food":
        return <Utensils className="h-10 w-10" style={{ color: primaryColor }} />
      case "payment":
        return <CreditCard className="h-10 w-10" style={{ color: primaryColor }} />
      case "invoice":
        return <FileText className="h-10 w-10" style={{ color: primaryColor }} />
      default:
        return <Calendar className="h-10 w-10" style={{ color: primaryColor }} />
    }
  }

  const getDefaultButtonText = () => {
    switch (icon) {
      case "workout":
        return "Ver todas las rutinas"
      case "food":
        return "Ver todos los planes"
      case "payment":
        return "Ver métodos de pago"
      case "invoice":
        return "Ver facturas"
      default:
        return "Ver todas las clases"
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-h-[90vh]">
      {getIcon()}
      <h2 className="text-2xl font-semibold mt-4">{title}</h2>
      <p className="text-muted-foreground text-sm mt-2">{description}</p>
      {showRedirectButton &&
        (href ? (
          <Button variant="outline" className="mt-4" asChild>
            <Link href={href}>
              {buttonText || getDefaultButtonText()}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" className="mt-4">
            {buttonText || getDefaultButtonText()}
          </Button>
        ))}
    </div>
  )
}

export default EmptyState