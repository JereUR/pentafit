"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CalendarIcon, UserIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EditUserForm } from "./EditUserForm"
import type { ClientUserProfileData } from "@/types/user"
import avatarPlaceholder from "@/assets/avatar-placeholder.png"
import { PlanDetailsDialog } from "./PlanDetailsDialog"
import { UserMeasurementsCard } from "./UserMeasurementsCard"

interface ClientUserProfileProps {
  user: ClientUserProfileData
  loggedUserId: string
  primaryColor?: string
  isOwnProfile: boolean
}

export function ClientUserProfile({ user, loggedUserId, primaryColor, isOwnProfile }: ClientUserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)

  const activePlan = user.plan.find((up) => up.plan)?.plan

  return (
    <div className="container mx-auto p-4 relative">
      <Card className="w-full max-w-2xl mx-auto shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">Mi Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-2" style={{ borderColor: primaryColor }}>
                <AvatarImage
                  src={user.avatarUrl || (avatarPlaceholder.src as string)}
                  alt={`${user.firstName} ${user.lastName}`}
                />
                <AvatarFallback style={{ backgroundColor: primaryColor }}>
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-grow">
              <h2 className="text-3xl font-bold mb-1">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-muted-foreground mb-2">{user.email}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="text-muted-foreground" />
                  <span>{user.birthday}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserIcon className="text-muted-foreground" />
                  <span>{user.gender}</span>
                </div>
                {activePlan && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Plan: {activePlan.name}</span>
                    <PlanDetailsDialog plan={activePlan} primaryColor={primaryColor} />
                  </div>
                )}
              </div>
            </div>
          </div>
          {user.id === loggedUserId && (
            <div className="flex space-x-4 mt-4">
              <Button
                onClick={() => setIsEditing(true)}
                style={{ backgroundColor: primaryColor }}
                className="transition-all hover:opacity-90"
              >
                Editar Perfil
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {isOwnProfile && user.measurements && user.measurements.length > 0 && (
        <UserMeasurementsCard measurements={user.measurements} primaryColor={primaryColor} />
      )}

      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-background shadow-lg z-50"
            style={{ top: 0 }}
          >
            <EditUserForm user={user} onClose={() => setIsEditing(false)} primaryColor={primaryColor} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
