"use client"

import { useQuery } from "@tanstack/react-query"
import { getCurrentDayOfWeek, DAY_DISPLAY_NAMES } from "@/lib/utils"
import type { TodayRoutineData } from "@/types/routine"
import { DiaryAttendanceResponse, TodayDiaryItem, TodayDiaryResponseItem } from "@/types/diaryClient"
import { TodayNutritionalPlanData } from "@/types/nutritionaPlansClient"

async function fetchRoutineData(
  facilityId: string,
): Promise<TodayRoutineData | null> {
  const response = await fetch(`/api/user/today-routine/${facilityId}`)
  const result = await response.json()
  return result.data || null
}

async function fetchNutritionData(
  facilityId: string,
): Promise<TodayNutritionalPlanData | null> {
  const response = await fetch(`/api/user/today-nutrition/${facilityId}`)
  const result = await response.json()
  return result.data || null
}

async function fetchDiaryData(facilityId: string): Promise<TodayDiaryItem[] | null> {
  try {
    const diaryResponse = await fetch(`/api/user/today-diary/${facilityId}`)
    if (!diaryResponse.ok) throw new Error("Failed to fetch diary data")
    
    const diaryResult = await diaryResponse.json()
    const diaries: TodayDiaryResponseItem[] = diaryResult.data || []
    
    if (diaries.length === 0) {
      return null
    }

    const scheduleIds = diaries.flatMap(diary => 
      diary.schedule.map(schedule => schedule.id)
    )

    const queryParams = new URLSearchParams()
    scheduleIds.forEach(id => queryParams.append('dayAvailableIds', id))
    
    const attendanceResponse = await fetch(
      `/api/user/today-attendances/${facilityId}?${queryParams.toString()}`, 
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
    
    if (!attendanceResponse.ok) throw new Error("Failed to fetch attendance data")
    
    const attendanceResult = await attendanceResponse.json()
    const attendances: DiaryAttendanceResponse[] = attendanceResult.data || []

    return diaries.map(diary => ({
      ...diary,
      schedule: diary.schedule.map(schedule => ({
        ...schedule,
        attended: attendances.some(a => a.attended)
      }))
    }))
  } catch (error) {
    console.error("Error fetching diary data:", error)
    return null
  }
}

export function useTodayClientData(facilityId: string) {
  const today = getCurrentDayOfWeek()
  const dayName = DAY_DISPLAY_NAMES[today]

  const routineQuery = useQuery({
    queryKey: ["todayRoutine", facilityId],
    queryFn: () => fetchRoutineData(facilityId),
    enabled: !!facilityId,
  })

  const nutritionQuery = useQuery({
    queryKey: ["todayNutrition", facilityId],
    queryFn: () => fetchNutritionData(facilityId),
    enabled: !!facilityId,
  })

  const diaryQuery = useQuery<TodayDiaryItem[] | null>({
    queryKey: ["todayDiary", facilityId],
    queryFn: () => fetchDiaryData(facilityId),
    enabled: !!facilityId,
  })

  const isLoading =
    routineQuery.isLoading || nutritionQuery.isLoading || diaryQuery.isLoading
  const error = routineQuery.error || nutritionQuery.error || diaryQuery.error
  const errorMessage = error
    ? "Error al cargar los datos. Por favor, intenta de nuevo."
    : null

  return {
    isLoading,
    routineData: routineQuery.data,
    nutritionData: nutritionQuery.data,
    diaryData: diaryQuery.data,
    error: errorMessage,
    today,
    dayName,
  }
}