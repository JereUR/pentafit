"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Allergy, ChronicCondition, Injury, Medication, UserHealthInfo } from "@/types/health"
import { HealthSummary } from "./HealthSummary"
import { ChronicConditionsTab } from "./ChronicConditionsTab"
import { AllergiesTab } from "./AllergiesTab"
import { InjuriesTab } from "./InjuriesTab"
import { MedicationsTab } from "./MedicationsTab"

interface HealthTabsProps {
  healthInfo: UserHealthInfo
  activeTab: string
  setActiveTab: (tab: string) => void
  primaryColor?: string
}

export function HealthTabs({ healthInfo, activeTab, setActiveTab, primaryColor }: HealthTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full" onValueChange={(value) => setActiveTab(value)}>
      <TabsList className="mb-4">
        <TabsTrigger
          value="overview"
          className="text-sm"
          style={{
            backgroundColor: activeTab === "overview" ? primaryColor : "transparent",
            color: activeTab === "overview" ? "#ffffff" : "inherit",
          }}
        >
          Resumen
        </TabsTrigger>
        {healthInfo.hasChronicConditions && (
          <TabsTrigger
            value="conditions"
            className="text-sm"
            style={{
              backgroundColor: activeTab === "conditions" ? primaryColor : "transparent",
              color: activeTab === "conditions" ? "#ffffff" : "inherit",
            }}
          >
            Condiciones
          </TabsTrigger>
        )}
        {healthInfo.takingMedication && (
          <TabsTrigger
            value="medications"
            className="text-sm"
            style={{
              backgroundColor: activeTab === "medications" ? primaryColor : "transparent",
              color: activeTab === "medications" ? "#ffffff" : "inherit",
            }}
          >
            Medicamentos
          </TabsTrigger>
        )}
        {healthInfo.hasInjuries && (
          <TabsTrigger
            value="injuries"
            className="text-sm"
            style={{
              backgroundColor: activeTab === "injuries" ? primaryColor : "transparent",
              color: activeTab === "injuries" ? "#ffffff" : "inherit",
            }}
          >
            Lesiones
          </TabsTrigger>
        )}
        {healthInfo.hasAllergies && (
          <TabsTrigger
            value="allergies"
            className="text-sm"
            style={{
              backgroundColor: activeTab === "allergies" ? primaryColor : "transparent",
              color: activeTab === "allergies" ? "#ffffff" : "inherit",
            }}
          >
            Alergias
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="overview">
        <HealthSummary healthInfo={healthInfo} />
      </TabsContent>

      {healthInfo.hasChronicConditions && (
        <TabsContent value="conditions">
          <ChronicConditionsTab conditions={healthInfo.chronicConditions as ChronicCondition[]} />
        </TabsContent>
      )}

      {healthInfo.takingMedication && (
        <TabsContent value="medications">
          <MedicationsTab medications={healthInfo.medications as Medication[]} />
        </TabsContent>
      )}

      {healthInfo.hasInjuries && (
        <TabsContent value="injuries">
          <InjuriesTab injuries={healthInfo.injuries as Injury[]} />
        </TabsContent>
      )}

      {healthInfo.hasAllergies && (
        <TabsContent value="allergies">
          <AllergiesTab allergies={healthInfo.allergies as Allergy[]} />
        </TabsContent>
      )}
    </Tabs>
  )
}
