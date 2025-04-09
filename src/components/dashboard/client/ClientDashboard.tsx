"use client"

import { CalendarCheck, Utensils, Calendar } from "lucide-react"
import { Suspense, useState, useEffect } from "react"

import { ClientDashboardSkeleton } from "@/components/skeletons/ClientDashboardSkeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useClientFacility } from "@/contexts/ClientFacilityContext"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { TodayRoutine } from "./TodayRoutine"
import { TodayNutritionalPlan } from "./TodayNutritionalPlan"
import { TodayDiary } from "./TodayDiary"

interface ClientDashboardProps {
  facilityId: string
}

export function ClientDashboard({ facilityId }: ClientDashboardProps) {
  const { primaryColor } = useClientFacility()
  const isMobile = useMediaQuery("(max-width: 767px)")
  const [activeTab, setActiveTab] = useState("routine")

  useEffect(() => {
    setActiveTab("routine")
  }, [])

  const getTabStyle = (tabValue: string) => {
    const isActive = activeTab === tabValue
    return {
      backgroundColor: isActive ? primaryColor : "transparent",
      color: isActive ? "white" : "inherit",
    }
  }

  if (isMobile) {
    return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="routine" style={getTabStyle("routine")}>
            Rutina
          </TabsTrigger>
          <TabsTrigger value="nutrition" style={getTabStyle("nutrition")}>
            Nutrición
          </TabsTrigger>
          <TabsTrigger value="diary" style={getTabStyle("diary")}>
            Clases
          </TabsTrigger>
        </TabsList>

        <TabsContent value="routine" className="mt-0">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <CalendarCheck className="h-6 w-6" style={{ color: primaryColor }} />
              <div>
                <CardTitle>Rutina de Hoy</CardTitle>
                <CardDescription>Tu plan de entrenamiento para hoy</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ClientDashboardSkeleton type="routine" />}>
                <TodayRoutine facilityId={facilityId} primaryColor={primaryColor} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition" className="mt-0">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Utensils className="h-6 w-6" style={{ color: primaryColor }} />
              <div>
                <CardTitle>Nutrición de Hoy</CardTitle>
                <CardDescription>Tu plan de alimentación para hoy</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ClientDashboardSkeleton type="nutrition" />}>
                <TodayNutritionalPlan facilityId={facilityId} primaryColor={primaryColor} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diary" className="mt-0">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Calendar className="h-6 w-6" style={{ color: primaryColor }} />
              <div>
                <CardTitle>Clases de Hoy</CardTitle>
                <CardDescription>Tus clases programadas para hoy</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ClientDashboardSkeleton type="diary" />}>
                <TodayDiary facilityId={facilityId} primaryColor={primaryColor} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Suspense fallback={<ClientDashboardSkeleton type="routine" />}>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <CalendarCheck className="h-6 w-6" style={{ color: primaryColor }} />
            <div>
              <CardTitle>Rutina de Hoy</CardTitle>
              <CardDescription>Tu plan de entrenamiento para hoy</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <TodayRoutine facilityId={facilityId} primaryColor={primaryColor} />
          </CardContent>
        </Card>
      </Suspense>

      <Suspense fallback={<ClientDashboardSkeleton type="nutrition" />}>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Utensils className="h-6 w-6" style={{ color: primaryColor }} />
            <div>
              <CardTitle>Nutrición de Hoy</CardTitle>
              <CardDescription>Tu plan de alimentación para hoy</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <TodayNutritionalPlan facilityId={facilityId} primaryColor={primaryColor} />
          </CardContent>
        </Card>
      </Suspense>

      <Suspense fallback={<ClientDashboardSkeleton type="diary" />}>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Calendar className="h-6 w-6" style={{ color: primaryColor }} />
            <div>
              <CardTitle>Clases de Hoy</CardTitle>
              <CardDescription>Tus clases programadas para hoy</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <TodayDiary facilityId={facilityId} primaryColor={primaryColor} />
          </CardContent>
        </Card>
      </Suspense>
    </div>
  )
}
