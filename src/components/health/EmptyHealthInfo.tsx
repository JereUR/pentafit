"use client"

import { HeartPulse, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { UserHealthInfo } from "@/types/health"
import { HealthInfoForm } from "../users/HealthInfoForm"

interface EmptyHealthInfoProps {
  healthInfo?: UserHealthInfo
  userId: string
  facilityId: string
  primaryColor?: string
  showHealthForm: boolean
  setShowHealthForm: (show: boolean) => void
  message: string
  description: string
  buttonText: string
}

export function EmptyHealthInfo({
  healthInfo,
  userId,
  facilityId,
  primaryColor,
  showHealthForm,
  setShowHealthForm,
  message,
  description,
  buttonText,
}: EmptyHealthInfoProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-md mt-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Información Médica</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="text-center py-8">
        <HeartPulse className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">{message}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        <Button onClick={() => setShowHealthForm(true)} style={{ backgroundColor: primaryColor }}>
          <Plus className="mr-2 h-4 w-4" /> {buttonText}
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
