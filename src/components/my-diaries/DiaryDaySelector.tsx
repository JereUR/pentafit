"use client"

import { useState, useEffect, useRef } from "react"
import { Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { daysOfWeekFull } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import type { DayAvailable, DayWithInfo } from "@/types/diaryClient"
import LoadingButton from "../LoadingButton"

interface DiaryDaySelectorProps {
  diaryId: string
  diaryName: string
  daysAvailable: DayAvailable[]
  diaryPlanDaysOfWeek: boolean[]
  sessionsPerWeek: number
  onSubscribe: (diaryId: string, selectedDayIds: string[]) => void
  isOpen: boolean
  onClose: () => void
  isPending: boolean
  primaryColor: string
}

export function DiaryDaySelector({
  diaryId,
  diaryName,
  daysAvailable,
  diaryPlanDaysOfWeek,
  sessionsPerWeek,
  onSubscribe,
  isOpen,
  onClose,
  isPending,
  primaryColor,
}: DiaryDaySelectorProps) {
  const [selectedDayIds, setSelectedDayIds] = useState<string[]>([])
  const limitReachedRef = useRef(false)

  useEffect(() => {
    if (isOpen) {
      setSelectedDayIds([])
      limitReachedRef.current = false
    }
  }, [isOpen])

  useEffect(() => {
    if (limitReachedRef.current) {
      toast({
        title: "Límite alcanzado",
        description: `Solo puedes seleccionar ${sessionsPerWeek} días por semana`,
        variant: "destructive",
      })
      limitReachedRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionsPerWeek, limitReachedRef.current])

  const handleDayToggle = (dayId: string) => {
    setSelectedDayIds((prev) => {
      if (prev.includes(dayId)) {
        return prev.filter((id) => id !== dayId)
      }

      if (prev.length < sessionsPerWeek) {
        return [...prev, dayId]
      }

      limitReachedRef.current = true
      return prev
    })
  }

  const handleSubmit = () => {
    if (selectedDayIds.length === 0) {
      toast({
        title: "Selección requerida",
        description: "Debes seleccionar al menos un día",
        variant: "destructive",
      })
      return
    }

    const invalidDays = selectedDayIds.some(dayId => {
      const day = availableDaysWithInfo.find(d => d.id === dayId)
      return !day || !diaryPlanDaysOfWeek[day.dayOfWeek]
    })

    if (invalidDays) {
      toast({
        title: "Días no permitidos",
        description: "Algunos días seleccionados no están permitidos en este plan",
        variant: "destructive",
      })
      return
    }

    onSubscribe(diaryId, selectedDayIds)
  }

  const getAvailableDaysWithInfo = (): DayWithInfo[] => {
    const filteredDays = daysAvailable
      .filter((day) => {
        if (day.dayOfWeek === null || day.dayOfWeek < 0 || day.dayOfWeek > 6) {
          return false
        }
        return (
          day.available &&
          diaryPlanDaysOfWeek[day.dayOfWeek] === true &&
          day.timeStart &&
          day.timeEnd
        )
      })
      .map((day) => ({
        id: day.id,
        timeStart: day.timeStart,
        timeEnd: day.timeEnd,
        dayOfWeek: day.dayOfWeek,
        dayName: daysOfWeekFull[day.dayOfWeek] || `Día ${day.dayOfWeek + 1}`,
        available: true,
      }))
    return filteredDays
  }

  const availableDaysWithInfo = getAvailableDaysWithInfo()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-base sm:text-lg">Selecciona los días para {diaryName}</DialogTitle>
        </DialogHeader>

        <div className="py-3 sm:py-4">
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 text-center">
            Selecciona hasta {sessionsPerWeek} días por semana para esta actividad.
          </p>

          <div className="space-y-2">
            {availableDaysWithInfo.map((day) => (
              <div
                key={day.id}
                className={`flex items-center justify-between p-2 sm:p-3 rounded-md border cursor-pointer transition-colors`}
                style={{
                  backgroundColor: selectedDayIds.includes(day.id) ? `${primaryColor}20` : "",
                  borderColor: selectedDayIds.includes(day.id) ? primaryColor : "",
                }}
                onClick={() => handleDayToggle(day.id)}
              >
                <div>
                  <p className="font-medium text-sm sm:text-base">{day.dayName}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {day.timeStart} - {day.timeEnd}
                  </p>
                </div>
                <div
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center ${selectedDayIds.includes(day.id) ? "text-white" : "border"
                    }`}
                  style={{
                    backgroundColor: selectedDayIds.includes(day.id) ? primaryColor : "",
                  }}
                >
                  {selectedDayIds.includes(day.id) && <Check className="h-2 w-2 sm:h-3 sm:w-3" />}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 sm:mt-4 flex items-center justify-between">
            <p className="text-xs sm:text-sm font-medium">
              Seleccionados: {selectedDayIds.length}/{sessionsPerWeek}
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose} disabled={isPending} className="w-full sm:w-auto">
            <X className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Cancelar
          </Button>
          <LoadingButton
            onClick={handleSubmit}
            disabled={isPending || selectedDayIds.length === 0}
            style={{ backgroundColor: primaryColor }}
            loading={isPending}
            className="w-full sm:w-auto"
          >
            <Check className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Confirmar
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

