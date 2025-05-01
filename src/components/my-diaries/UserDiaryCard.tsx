"use client"

import { Clock, Calendar, Users, X } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { daysOfWeekFull, formatDate } from "@/lib/utils"
import type { UserDiaryData } from "@/types/user"
import { useUnsubscribeFromDiaryMutation } from "@/app/(main)/(authenticated)/(client)/[facilityId]/mi-agenda/mutations"
import LoadingButton from "../LoadingButton"

interface UserDiaryCardProps {
  userDiary: UserDiaryData
  facilityId: string
  primaryColor: string
}

export function UserDiaryCard({ userDiary, facilityId, primaryColor }: UserDiaryCardProps) {
  const { mutate: unsubscribe, isPending } = useUnsubscribeFromDiaryMutation()

  const handleCancel = () => {
    unsubscribe({ userDiaryId: userDiary.id, facilityId })
  }

  const daysToDisplay = userDiary.selectedDays && userDiary.selectedDays.length > 0
    ? userDiary.selectedDays
    : userDiary.diary.daysAvailable.filter((day) => day.available)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 px-3 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-md"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <Clock className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: primaryColor }} />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm sm:text-base truncate">{userDiary.diary.name}</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {userDiary.diary.activity.name}
              </p>
            </div>
          </div>
          <LoadingButton
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-full ml-2 flex-shrink-0"
            onClick={handleCancel}
            loading={isPending}
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="sr-only">Cancelar inscripción</span>
          </LoadingButton>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground truncate">
              Desde: {formatDate(new Date(userDiary.startDate))}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground truncate">
              {userDiary.diary.amountOfPeople} personas max.
            </span>
          </div>
        </div>

        <div className="mt-2">
          <p className="text-xs font-medium mb-1">Tus horarios:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {daysToDisplay.map((day) => (
              <div
                key={day.id}
                className="text-[10px] sm:text-xs p-1 border rounded flex items-center justify-between"
              >
                <span className="truncate">
                  {day.timeStart} - {day.timeEnd}
                </span>
                {day.dayOfWeek !== undefined && (
                  <Badge variant="outline" className="text-[8px] sm:text-[10px] px-1 py-0 ml-1 flex-shrink-0">
                    {daysOfWeekFull[day.dayOfWeek]}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}