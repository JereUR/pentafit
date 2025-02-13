import { Dispatch, SetStateAction, useState } from "react"

import { MultiSelect } from "@/components/ui/multi-select"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { daysOfWeek } from "@/lib/utils"
import { AllDIaryData } from "@/types/diary"
import { DiaryPlansValues } from "@/types/plan"

interface ActivitySelectorProps {
  diaries: AllDIaryData[]
  onChange: Dispatch<SetStateAction<DiaryPlansValues[]>>
}

export function ActivitySelector({ diaries, onChange }: ActivitySelectorProps) {
  const [selectedDiaries, setSelectedDiaries] = useState<DiaryPlansValues[]>([])

  const handleSelect = (selectedIds: string[]) => {
    const newSelected = selectedIds.map((id) => {
      const diary = diaries.find((d) => d.id === id)
      if (!diary) return null
      return {
        name: diary.activityName,
        daysOfWeek: diary.daysAvailable,
        sessionsPerWeek: 1,
        activityId: diary.activityId,
      }
    }).filter(Boolean) as DiaryPlansValues[]

    console.log({newSelected})

    setSelectedDiaries(newSelected)
    onChange(newSelected)
  }

  const handleUpdate = (index: number, updatedValues: Partial<DiaryPlansValues>) => {
    const updatedDiaries = [...selectedDiaries]
    updatedDiaries[index] = { ...updatedDiaries[index], ...updatedValues }
    setSelectedDiaries(updatedDiaries)
    onChange(updatedDiaries)
  }

  return (
    <div className="space-y-4">
      <MultiSelect
        options={diaries.map((diary) => ({
          label: `${diary.name} - ${diary.activityName}`,
          value: diary.id,
        }))}
        selected={selectedDiaries.map((d) => d.activityId)}
        onChange={handleSelect}
        placeholder="Seleccionar actividades"
        searchText="Buscar actividad"
      />

      {selectedDiaries.map((diary, index) => (
        <div key={diary.activityId} className="border p-4 rounded-lg space-y-3">
          <h3 className="text-lg font-semibold">{diary.name}</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Sesiones por semana</label>
              <Input
                type="number"
                min={1}
                value={diary.sessionsPerWeek}
                onChange={(e) => handleUpdate(index, { sessionsPerWeek: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {daysOfWeek.map((day, dayIndex) => {
              const dayData = diary.daysOfWeek[dayIndex]
              return (
                <div key={dayIndex} className="flex items-center space-x-2">
                  <Switch
                    checked={dayData}
                    onCheckedChange={(e) => handleUpdate(index, {
                      daysOfWeek: {
                        ...diary.daysOfWeek,
                        [dayIndex]: e,
                      },
                    })}
                    disabled={!dayData}
                  />
                  <span className={dayData ? "text-black" : "text-gray-400"}>{day}</span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
