'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EditUserForm } from './EditUserForm'
import { UserData } from '@/types/user'
import avatarPlaceholder from "@/assets/avatar-placeholder.png"

interface UserProfileProps {
  user: UserData
  loggedUserId: string
}

export function UserProfile({ user, loggedUserId }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="container mx-auto p-4 relative">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Mi Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={user.avatarUrl || (avatarPlaceholder.src as string)}
                  alt={`${user.firstName} ${user.lastName}`}
                />
                <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p><strong>Fecha de Nacimiento:</strong> {user.birthday}</p>
            <p><strong>Género:</strong> {user.gender}</p>
            <p><strong>Membresía:</strong> {user.membershipLevel}</p>
          </div>
          {user.id === loggedUserId && <Button className="mt-4" onClick={() => setIsEditing(true)}>
            Editar Perfil
          </Button>}
        </CardContent>
      </Card>
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-background shadow-lg z-50"
            style={{ top: 0 }}
          >
            <EditUserForm user={user} onClose={() => setIsEditing(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

