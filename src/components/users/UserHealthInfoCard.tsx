"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserHealthInfo } from "@/types/health"
import { EmptyHealthInfo } from "../health/EmptyHealthInfo"
import { HealthTabs } from "../health/HealthTabs"
import { HealthFormDrawer } from "../health/HealthFormDrawer"

interface UserHealthInfoCardProps {
  healthInfo?: UserHealthInfo
  primaryColor?: string
  userId: string
  facilityId: string
}

export function UserHealthInfoCard({ healthInfo, primaryColor, userId, facilityId }: UserHealthInfoCardProps) {
  const [showHealthForm, setShowHealthForm] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  if (!healthInfo) {
    return (
      <EmptyHealthInfo
        healthInfo={healthInfo}
        userId={userId}
        facilityId={facilityId}
        primaryColor={primaryColor}
        showHealthForm={showHealthForm}
        setShowHealthForm={setShowHealthForm}
        message="No hay información médica registrada"
        description="Agregar información médica ayuda a los entrenadores a personalizar tus rutinas de forma segura"
        buttonText="Agregar Información Médica"
      />
    )
  }

  const hasAnyMedicalInfo =
    healthInfo.hasChronicConditions ||
    healthInfo.takingMedication ||
    healthInfo.hasInjuries ||
    healthInfo.hasAllergies ||
    healthInfo.emergencyContactName

  if (!hasAnyMedicalInfo) {
    return (
      <EmptyHealthInfo
        healthInfo={healthInfo}
        userId={userId}
        facilityId={facilityId}
        primaryColor={primaryColor}
        showHealthForm={showHealthForm}
        setShowHealthForm={setShowHealthForm}
        message="Sin condiciones médicas reportadas"
        description="No has reportado condiciones médicas o alergias"
        buttonText="Actualizar Información Médica"
      />
    )
  }

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto shadow-md mt-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Información Médica</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowHealthForm(true)}>
                Editar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <HealthTabs
            healthInfo={healthInfo}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            primaryColor={primaryColor}
          />
        </CardContent>
      </Card>

      <HealthFormDrawer
        healthInfo={healthInfo}
        userId={userId}
        facilityId={facilityId}
        primaryColor={primaryColor}
        showHealthForm={showHealthForm}
        setShowHealthForm={setShowHealthForm}
      />
    </>
  )
}
