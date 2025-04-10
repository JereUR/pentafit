"use client"

import { useState } from "react"
import { Utensils } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useUserNutritionalPlan } from "@/hooks/useUserNutritionalPlan"
import type { DayOfWeek } from "@prisma/client"

import { NutritionalPlanEmpty } from "./NutritionalPlanEmpty"
import { MealCarousel } from "./MealCarousel"
import { NutritionalPlanSkeleton } from "../skeletons/NutritionalPlanSkeleton"
import { DaySelector } from "../my-routine/DaySelector"

interface WeeklyNutritionalPlanViewProps {
  facilityId: string
  primaryColor: string
}

export function WeeklyNutritionalPlanView({ facilityId, primaryColor }: WeeklyNutritionalPlanViewProps) {
  const { isLoading, data: nutritionalPlanData, error, dayNames } = useUserNutritionalPlan(facilityId)
  const [activeDay, setActiveDay] = useState<DayOfWeek>("MONDAY")

  if (isLoading) {
    return <NutritionalPlanSkeleton primaryColor={primaryColor} />
  }

  if (error) {
    return <div className="p-4 text-sm text-red-500">{error}</div>
  }

  if (!nutritionalPlanData) {
    return <NutritionalPlanEmpty primaryColor={primaryColor} />
  }

  const dayKeys = Object.keys(dayNames) as DayOfWeek[]
  const activeMeals = nutritionalPlanData.dailyMeals.find((dm) => dm.dayOfWeek === activeDay)?.meals || []

  return (
    <div className="space-y-6 w-full">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center gap-2">
          <Utensils className="h-6 w-6" style={{ color: primaryColor }} />
          <div>
            <CardTitle>Mi Plan Nutricional: {nutritionalPlanData.name}</CardTitle>
            {nutritionalPlanData.description && <CardDescription>{nutritionalPlanData.description}</CardDescription>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="lg:hidden">
            <Tabs
              defaultValue="MONDAY"
              onValueChange={(value) => {
                setActiveDay(value as DayOfWeek)
              }}
            >
              <TabsList className="grid grid-cols-7 mb-6">
                {dayKeys.map((day) => (
                  <TabsTrigger
                    key={day}
                    value={day}
                    style={activeDay === day ? { backgroundColor: primaryColor, color: "white" } : {}}
                  >
                    {dayNames[day].slice(0, 3)}
                  </TabsTrigger>
                ))}
              </TabsList>

              {dayKeys.map((day) => (
                <TabsContent key={day} value={day}>
                  {nutritionalPlanData.dailyMeals.find((dm) => dm.dayOfWeek === day) ? (
                    <MealCarousel
                      meals={nutritionalPlanData.dailyMeals.find((dm) => dm.dayOfWeek === day)?.meals || []}
                      primaryColor={primaryColor}
                      dayName={dayNames[day]}
                      itemsPerPage={1}
                    />
                  ) : null}
                </TabsContent>
              ))}
            </Tabs>
          </div>
          <div className="hidden lg:block">
            <div className="flex flex-col space-y-6">
              <DaySelector
                dayKeys={dayKeys}
                dayNames={dayNames}
                activeDay={activeDay}
                setActiveDay={setActiveDay}
                primaryColor={primaryColor}
              />
              <h2 className="text-xl font-semibold text-center" style={{ color: primaryColor }}>
                Comidas para {dayNames[activeDay]}
              </h2>
              <MealCarousel
                meals={activeMeals}
                primaryColor={primaryColor}
                dayName={dayNames[activeDay]}
                itemsPerPage={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
