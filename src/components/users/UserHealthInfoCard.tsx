"use client"

import { useState } from "react"
import {
  HeartPulse,
  AlertCircle,
  Pill,
  LigatureIcon as Bandage,
  AlertTriangle,
  Plus,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { UserHealthInfo, ChronicCondition, Medication, Injury, Allergy } from "@/types/health"
import { HealthInfoForm } from "./HealthInfoForm"

interface UserHealthInfoCardProps {
  healthInfo?: UserHealthInfo
  primaryColor?: string
  userId: string
  facilityId: string
}

export function UserHealthInfoCard({ healthInfo, primaryColor, userId, facilityId }: UserHealthInfoCardProps) {
  /* const [isExpanded, setIsExpanded] = useState(false) */
  const [showHealthForm, setShowHealthForm] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  if (!healthInfo) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-md mt-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Información Médica</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center py-8">
          <HeartPulse className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No hay información médica registrada</h3>
          <p className="text-muted-foreground mb-6">
            Agregar información médica ayuda a los entrenadores a personalizar tus rutinas de forma segura
          </p>
          <Button onClick={() => setShowHealthForm(true)} style={{ backgroundColor: primaryColor }}>
            <Plus className="mr-2 h-4 w-4" /> Agregar Información Médica
          </Button>
        </CardContent>

        <AnimatePresence>
          {showHealthForm && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-full max-w-md bg-background shadow-lg z-50"
              style={{ top: 0, maxHeight: "100vh" }}
            >
              <HealthInfoForm
                healthInfo={healthInfo}
                userId={userId}
                facilityId={facilityId}
                onClose={() => setShowHealthForm(false)}
                primaryColor={primaryColor}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
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
      <Card className="w-full max-w-2xl mx-auto shadow-md mt-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Información Médica</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center py-8">
          <HeartPulse className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Sin condiciones médicas reportadas</h3>
          <p className="text-muted-foreground mb-6">No has reportado condiciones médicas o alergias</p>
          <Button
            onClick={() => {
              console.log("Button clicked, showing health form")
              setShowHealthForm(true)
            }}
            style={{ backgroundColor: primaryColor }}
          >
            Actualizar Información Médica
          </Button>
        </CardContent>

        <AnimatePresence>
          {showHealthForm && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-full max-w-md bg-background shadow-lg z-50"
              style={{ top: 0, maxHeight: "100vh" }}
            >
              <HealthInfoForm
                healthInfo={healthInfo}
                userId={userId}
                facilityId={facilityId}
                onClose={() => setShowHealthForm(false)}
                primaryColor={primaryColor}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "MILD":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "MODERATE":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "SEVERE":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "MILD":
        return "Leve"
      case "MODERATE":
        return "Moderada"
      case "SEVERE":
        return "Severa"
      default:
        return severity
    }
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
              {/* <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-muted-foreground"
              >
                {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button> */}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full"
            onValueChange={(value) => setActiveTab(value)}>
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex flex-col items-center p-3 rounded-lg border bg-background">
                  <AlertCircle
                    className={`h-6 w-6 mb-2 ${healthInfo.hasChronicConditions ? "text-red-500" : "text-muted-foreground"
                      }`}
                  />
                  <div className="text-sm font-medium">Condiciones Crónicas</div>
                  <div className="text-xs text-muted-foreground">
                    {healthInfo.hasChronicConditions
                      ? `${(healthInfo.chronicConditions as ChronicCondition[])?.length || 0} reportadas`
                      : "Ninguna"}
                  </div>
                </div>

                <div className="flex flex-col items-center p-3 rounded-lg border bg-background">
                  <Pill
                    className={`h-6 w-6 mb-2 ${healthInfo.takingMedication ? "text-blue-500" : "text-muted-foreground"
                      }`}
                  />
                  <div className="text-sm font-medium">Medicamentos</div>
                  <div className="text-xs text-muted-foreground">
                    {healthInfo.takingMedication
                      ? `${(healthInfo.medications as Medication[])?.length || 0} activos`
                      : "Ninguno"}
                  </div>
                </div>

                <div className="flex flex-col items-center p-3 rounded-lg border bg-background">
                  <Bandage
                    className={`h-6 w-6 mb-2 ${healthInfo.hasInjuries ? "text-orange-500" : "text-muted-foreground"}`}
                  />
                  <div className="text-sm font-medium">Lesiones</div>
                  <div className="text-xs text-muted-foreground">
                    {healthInfo.hasInjuries
                      ? `${(healthInfo.injuries as Injury[])?.length || 0} reportadas`
                      : "Ninguna"}
                  </div>
                </div>

                <div className="flex flex-col items-center p-3 rounded-lg border bg-background">
                  <AlertTriangle
                    className={`h-6 w-6 mb-2 ${healthInfo.hasAllergies ? "text-yellow-500" : "text-muted-foreground"}`}
                  />
                  <div className="text-sm font-medium">Alergias</div>
                  <div className="text-xs text-muted-foreground">
                    {healthInfo.hasAllergies
                      ? `${(healthInfo.allergies as Allergy[])?.length || 0} reportadas`
                      : "Ninguna"}
                  </div>
                </div>
              </div>

              {healthInfo.emergencyContactName && (
                <div className="mt-6 p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Contacto de Emergencia</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Nombre:</span> {healthInfo.emergencyContactName}
                    </div>
                    <div>
                      <span className="font-medium">Teléfono:</span> {healthInfo.emergencyContactPhone}
                    </div>
                    <div>
                      <span className="font-medium">Relación:</span> {healthInfo.emergencyContactRelation}
                    </div>
                  </div>
                </div>
              )}

              {healthInfo.medicalNotes && (
                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2">Notas Médicas</h4>
                  <p className="text-muted-foreground">{healthInfo.medicalNotes}</p>
                </div>
              )}
            </TabsContent>

            {healthInfo.hasChronicConditions && (
              <TabsContent value="conditions">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Condiciones Crónicas</h3>
                  {(healthInfo.chronicConditions as ChronicCondition[])?.map((condition, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold">{condition.name}</h4>
                        <Badge className={getSeverityColor(condition.severity)}>
                          {getSeverityLabel(condition.severity)}
                        </Badge>
                      </div>
                      {condition.diagnosisDate && (
                        <p className="text-sm text-muted-foreground mt-1">Diagnosticado: {condition.diagnosisDate}</p>
                      )}
                      {condition.notes && <p className="mt-2 text-sm">{condition.notes}</p>}
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}

            {healthInfo.takingMedication && (
              <TabsContent value="medications">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Medicamentos</h3>
                  {(healthInfo.medications as Medication[])?.map((medication, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-semibold">{medication.name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
                        <div>
                          <span className="font-medium">Dosis:</span> {medication.dosage}
                        </div>
                        <div>
                          <span className="font-medium">Frecuencia:</span> {medication.frequency}
                        </div>
                      </div>
                      {medication.purpose && <p className="mt-2 text-sm text-muted-foreground">{medication.purpose}</p>}
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}

            {healthInfo.hasInjuries && (
              <TabsContent value="injuries">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Lesiones</h3>
                  {(healthInfo.injuries as Injury[])?.map((injury, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold">{injury.name}</h4>
                        <Badge className={getSeverityColor(injury.severity)}>{getSeverityLabel(injury.severity)}</Badge>
                      </div>
                      <p className="text-sm mt-1">
                        <span className="font-medium">Área afectada:</span> {injury.bodyPart}
                      </p>
                      {injury.dateOccurred && (
                        <p className="text-sm text-muted-foreground mt-1">Ocurrió: {injury.dateOccurred}</p>
                      )}
                      {injury.affectsExercise && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-100 rounded text-sm">
                          <p className="font-medium text-yellow-800">Afecta al ejercicio</p>
                          {injury.exerciseRestrictions && (
                            <p className="text-yellow-700">{injury.exerciseRestrictions}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}

            {healthInfo.hasAllergies && (
              <TabsContent value="allergies">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Alergias</h3>
                  {(healthInfo.allergies as Allergy[])?.map((allergy, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold">{allergy.allergen}</h4>
                        <Badge className={getSeverityColor(allergy.severity)}>
                          {getSeverityLabel(allergy.severity)}
                        </Badge>
                      </div>
                      <p className="text-sm mt-2">
                        <span className="font-medium">Reacción:</span> {allergy.reaction}
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
      <AnimatePresence>
        {showHealthForm && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 w-full max-w-md bg-background shadow-lg z-50"
            style={{ top: 0, maxHeight: "100vh" }}
          >
            <HealthInfoForm
              healthInfo={healthInfo}
              userId={userId}
              facilityId={facilityId}
              onClose={() => setShowHealthForm(false)}
              primaryColor={primaryColor}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </>
  )
}
