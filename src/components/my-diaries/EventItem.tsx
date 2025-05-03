import { Check, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import LoadingButton from "@/components/LoadingButton"
import { CalendarEvent } from "@/types/diaryClient"

interface EventItemProps {
  event: CalendarEvent
  primaryColor: string
  canMarkAttendance: boolean
  onAttendanceChange: (diaryId: string, userDiaryId: string, dayAvailableId: string, attended: boolean) => void
  localAttendances: Record<string, boolean>
  isMobile?: boolean
  isPending: boolean
}

export const EventItem = ({
  event,
  primaryColor,
  canMarkAttendance,
  onAttendanceChange,
  localAttendances,
  isMobile = false,
  isPending
}: EventItemProps) => {
  const key = `${event.diaryId}-${event.dayAvailableId}`
  const isAttended = localAttendances[key] ?? event.attended

  return (
    <div className={isMobile ? 'p-2' : 'p-1'}
      style={{ backgroundColor: `${primaryColor}20` }}>
      <div className="font-medium truncate" style={{ color: primaryColor }}>
        {event.title}
      </div>
      <div className={`${isMobile ? 'text-xs' : 'text-[10px]'} text-muted-foreground truncate`}>
        {event.time}
      </div>
      <div className={`${isMobile ? 'text-xs' : 'text-[10px]'} truncate`}>
        {event.diaryName}
      </div>

      {canMarkAttendance && event.dayAvailableId && (
        <div className={isMobile ? 'mt-2' : 'mt-1'}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Badge
            variant={isAttended ? "default" : "outline"}
            className={isMobile ? 'text-xs' : 'text-[10px]'}
            style={{
              backgroundColor: isAttended ? primaryColor : "transparent",
              borderColor: primaryColor
            }}
          >
            {isAttended ? "Asistiré" : "No asistiré"}
          </Badge>

          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <LoadingButton
              size="sm"
              loading={isPending}
              variant={isAttended ? "default" : "outline"}
              style={{
                backgroundColor: isAttended ? primaryColor : undefined,
                borderColor: primaryColor,
              }}
              onClick={() => onAttendanceChange(
                event.diaryId,
                event.userDiaryId,
                event.dayAvailableId,
                true
              )}
            >
              <Check className="h-3 w-3" />
            </LoadingButton>

            <LoadingButton
              size="sm"
              loading={isPending}
              variant={!isAttended ? "default" : "outline"}
              style={{
                backgroundColor: !isAttended ? "#ef4444" : undefined,
                borderColor: "#ef4444",
              }}
              onClick={() => onAttendanceChange(
                event.diaryId,
                event.userDiaryId,
                event.dayAvailableId,
                false
              )}
            >
              <X className="h-3 w-3" />
            </LoadingButton>
          </div>
        </div>
      )}
    </div>
  )
}