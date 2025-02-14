/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Dispatch, type SetStateAction, useEffect, useState } from "react"

import { MultiSelect } from "@/components/ui/multi-select"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { daysOfWeek } from "@/lib/utils"
import type { AllDIaryData } from "@/types/diary"
import type { DiaryPlansValues } from "@/types/plan"

interface ActivitySelectorProps {
  diaries: AllDIaryData[]
  onChange: Dispatch<SetStateAction<DiaryPlansValues[]>>
  initialDiaryPlans?: DiaryPlansValues[]
}

interface ExtendedDiaryPlanValues extends DiaryPlansValues {
  originalDaysAvailable: boolean[]
  diaryId: string
}

export function ActivitySelector({ diaries, onChange, initialDiaryPlans }: ActivitySelectorProps) {
  const [selectedDiaries, setSelectedDiaries] = useState<ExtendedDiaryPlanValues[]>([])

  useEffect(() => {
    if (initialDiaryPlans) {
      const extendedInitialDiaryPlans = initialDiaryPlans.map((plan) => {
        const diary = diaries.find((d) => d.activityId === plan.activityId)

        console.log({ diary })

        return {
          ...plan,
          originalDaysAvailable: diary?.daysAvailable || plan.daysOfWeek,
          diaryId: diary?.id || "",
        }
      })
      setSelectedDiaries(extendedInitialDiaryPlans)
      onChange(initialDiaryPlans)
    }
  }, [initialDiaryPlans, diaries, onChange])

  const handleSelect = (selectedIds: string[]) => {
    const newSelected = selectedIds
      .map((id) => {
        const diary = diaries.find((d) => d.id === id)
        if (!diary) return null
        return {
          name: diary.activityName,
          daysOfWeek: diary.daysAvailable,
          sessionsPerWeek: 1,
          activityId: diary.activityId,
          originalDaysAvailable: diary.daysAvailable,
          diaryId: diary.id,
        }
      })
      .filter(Boolean) as ExtendedDiaryPlanValues[]

    setSelectedDiaries(newSelected)
    onChange(newSelected.map(({ originalDaysAvailable, diaryId, ...rest }) => rest))
  }

  const handleUpdate = (diaryId: string, updatedValues: Partial<DiaryPlansValues>) => {
    const updatedDiaries = selectedDiaries.map((diary) =>
      diary.diaryId === diaryId ? { ...diary, ...updatedValues } : diary,
    )
    setSelectedDiaries(updatedDiaries)
    onChange(updatedDiaries.map(({ originalDaysAvailable, diaryId, ...rest }) => rest))
  }

  const handleRemove = (diaryId: string) => {
    const updatedDiaries = selectedDiaries.filter((diary) => diary.diaryId !== diaryId)
    setSelectedDiaries(updatedDiaries)
    onChange(updatedDiaries.map(({ originalDaysAvailable, diaryId, ...rest }) => rest))
  }

  return (
    <div className="space-y-4">
      <MultiSelect
        options={diaries.map((diary) => ({
          label: `${diary.name} - ${diary.activityName}`,
          value: diary.id,
        }))}
        selected={selectedDiaries.map((d) => d.diaryId)}
        onChange={handleSelect}
        placeholder="Seleccionar actividades"
        searchText="Buscar actividad"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedDiaries.map((diary) => (
          <div key={diary.id || diary.diaryId} className="border p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{diary.name}</h3>
              <button onClick={() => handleRemove(diary.diaryId)} className="text-red-500 hover:text-red-700">
                Eliminar
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium">Sesiones por semana</label>
              <Input
                type="number"
                min={1}
                value={diary.sessionsPerWeek}
                onChange={(e) => handleUpdate(diary.diaryId, { sessionsPerWeek: Number(e.target.value) })}
                className="mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Días disponibles</label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day, dayIndex) => {
                  const isOriginallyAvailable = diary.originalDaysAvailable[dayIndex]
                  const isChecked = diary.daysOfWeek[dayIndex]
                  return (
                    <div key={`${diary.diaryId}-${dayIndex}`} className="flex flex-col items-center">
                      <Switch
                        checked={isChecked}
                        onCheckedChange={(e) =>
                          handleUpdate(diary.diaryId, {
                            daysOfWeek: diary.daysOfWeek.map((d, i) => (i === dayIndex ? e : d)),
                          })
                        }
                        disabled={!isOriginallyAvailable}
                      />
                      <span
                        className={`text-xs mt-1 ${isOriginallyAvailable ? (isChecked ? "text-black" : "text-gray-600") : "text-gray-400"}`}
                      >
                        {day.slice(0, 3)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

