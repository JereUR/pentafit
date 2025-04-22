"use client"

import { motion, AnimatePresence } from "framer-motion"

import type { UserHealthInfo } from "@/types/health"
import { HealthInfoForm } from "../users/HealthInfoForm"

interface HealthFormDrawerProps {
  healthInfo?: UserHealthInfo
  userId: string
  facilityId: string
  primaryColor?: string
  showHealthForm: boolean
  setShowHealthForm: (show: boolean) => void
}

export function HealthFormDrawer({
  healthInfo,
  userId,
  facilityId,
  primaryColor,
  showHealthForm,
  setShowHealthForm,
}: HealthFormDrawerProps) {
  return (
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
  )
}
