"use client"

import { useState, useMemo, useEffect } from "react"
import { daysOfWeek, formatDate } from "@/lib/utils"

export function useWeeklyCalendar() {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day
    const startDate = new Date(today)
    startDate.setDate(diff)
    setCurrentWeekStart(startDate)
  }, [])

  const weekDays = useMemo(() => {
    if (!currentWeekStart) return []

    const days = []
    const startDate = new Date(currentWeekStart)

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)

      days.push({
        date,
        dayName: daysOfWeek[date.getDay()],
        dayNumber: date.getDate(),
        events: [],
      })
    }

    return days
  }, [currentWeekStart])

  const goToPreviousWeek = () => {
    if (!currentWeekStart) return
    const newDate = new Date(currentWeekStart)
    newDate.setDate(currentWeekStart.getDate() - 7)
    setCurrentWeekStart(newDate)
  }

  const goToNextWeek = () => {
    if (!currentWeekStart) return
    const newDate = new Date(currentWeekStart)
    newDate.setDate(currentWeekStart.getDate() + 7)
    setCurrentWeekStart(newDate)
  }

  const goToCurrentWeek = () => {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day
    const startDate = new Date(today)
    startDate.setDate(diff)
    setCurrentWeekStart(startDate)
  }

  const isCurrentWeek = () => {
    if (!currentWeekStart || !isClient) return false

    const today = new Date()
    const currentWeekStartDate = new Date(today)
    const day = today.getDay()
    const diff = today.getDate() - day
    currentWeekStartDate.setDate(diff)

    return (
      currentWeekStartDate.toDateString() === currentWeekStart.toDateString()
    )
  }

  const formatWeekRange = () => {
    if (!currentWeekStart) return ""

    const endDate = new Date(currentWeekStart)
    endDate.setDate(currentWeekStart.getDate() + 6)

    return `${formatDate(currentWeekStart)} - ${formatDate(endDate)}`
  }

  return {
    weekDays,
    currentWeekStart,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    isCurrentWeek,
    formatWeekRange,
  }
}
