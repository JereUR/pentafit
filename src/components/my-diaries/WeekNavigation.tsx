import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

interface WeekNavigationProps {
  goToPreviousWeek: () => void
  goToNextWeek: () => void
  goToCurrentWeek: () => void
  isCurrentWeek: () => boolean
}

export const WeekNavigation = ({
  goToPreviousWeek,
  goToNextWeek,
  goToCurrentWeek,
  isCurrentWeek
}: WeekNavigationProps) => (
  <>
    <Button variant="outline" size="sm" onClick={goToPreviousWeek} className="h-8 w-8 p-0">
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Semana anterior</span>
    </Button>

    {!isCurrentWeek() && (
      <Button variant="outline" size="sm" onClick={goToCurrentWeek} className="h-8 text-xs">
        Semana actual
      </Button>
    )}

    <Button variant="outline" size="sm" onClick={goToNextWeek} className="h-8 w-8 p-0">
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Semana siguiente</span>
    </Button>
  </>
)