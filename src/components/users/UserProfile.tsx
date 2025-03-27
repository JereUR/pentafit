'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarIcon, UserIcon, CrownIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EditUserForm } from './EditUserForm'
import { UserData } from '@/types/user'
import avatarPlaceholder from "@/assets/avatar-placeholder.png"
import { Role } from '@prisma/client'

interface UserProfileProps {
  user: UserData
  loggedUserId: string
}

export function UserProfile({ user, loggedUserId }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  return (
    <div className="container mx-auto p-4 relative">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Mi Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={user.avatarUrl || (avatarPlaceholder.src as string)}
                  alt={`${user.firstName} ${user.lastName}`}
                />
                <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-grow">
              <h2 className="text-3xl font-bold mb-1">{user.firstName} {user.lastName}</h2>
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
                <div className="flex items-center space-x-2">
                  <CrownIcon className="text-muted-foreground" />
                  <span>{user.membershipLevel}</span>
                </div>
              </div>
            </div>
          </div>
          {user.id === loggedUserId && (
            <div className="flex space-x-4 mt-4">
              <Button onClick={() => setIsEditing(true)}>
                Editar Perfil
              </Button>
              {user.role === Role.SUPER_ADMIN && <Button variant="outline" onClick={() => router.push(`/actualizar-membresia/${user.id}`)}>
                Actualizar Membresía
              </Button>}
            </div>
          )}
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

