"use client"

import { Clock, Calendar, Users, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { daysOfWeek, formatDate } from "@/lib/utils"
import { UserDiaryData } from '@/types/user'
import { useUnsubscribeFromDiaryMutation } from '@/app/(main)/(authenticated)/(client)/[facilityId]/mi-agenda/mutations'

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

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <Clock className="h-5 w-5" style={{ color: primaryColor }} />
            </div>
            <div>
              <CardTitle>{userDiary.diary.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{userDiary.diary.activity.name}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleCancel}
            disabled={isPending}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cancelar inscripción</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Desde: {formatDate(new Date(userDiary.startDate))}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">{userDiary.diary.amountOfPeople} personas</span>
          </div>
        </div>

        <div className="mt-2">
          <p className="text-xs font-medium mb-1">Horarios:</p>
          <div className="grid grid-cols-2 gap-2">
            {userDiary.diary.daysAvailable.map((day, index) => (
              day.available && (
                <div key={day.id} className="text-xs p-1 border rounded flex items-center justify-between">
                  <span>{day.timeStart} - {day.timeEnd}</span>
                  <Badge variant="outline" className="text-[10px] px-1 py-0">
                    {daysOfWeek[index]}
                  </Badge>
                </div>
              )
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

