import { AlertTriangle } from "lucide-react"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { UserClient } from "@/types/user"
import { HealthTooltipContent } from "./HealthTooltipContent"

interface HealthWarningTooltipProps {
  user: UserClient
}

export function HealthWarningTooltip({ user }: HealthWarningTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertTriangle className="h-4 w-4 text-amber-500 ml-1" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-card border-2 border-primary p-0 shadow-lg" side="right" sideOffset={5}>
          <HealthTooltipContent user={user} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
