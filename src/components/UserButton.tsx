"use client"

import Link from "next/link"
import { useQueryClient } from "@tanstack/react-query"
import { LogOutIcon, UserIcon } from "lucide-react"

import { useSession } from "@/app/(main)/SessionProvider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { logout } from "@/app/(auth)/action"
import UserAvatar from "./UserAvatar"
import { Role } from "@prisma/client"

interface UserButtonProps {
  className?: string
  userRole: Role
  facilityId?: string
  primaryColor?: string
}

export default function UserButton({ className, userRole, facilityId, primaryColor }: UserButtonProps) {
  const { user } = useSession()

  const queryClient = useQueryClient()

  if (!user) return

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <button className={cn("flex-none rounded-full", className)}>
          <UserAvatar avatarUrl={user.avatarUrl} size={40} primaryColor={primaryColor}/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[100]">
        <DropdownMenuLabel>
          Sesión iniciada como {user.firstName} {user.lastName}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={userRole === Role.CLIENT ? facilityId ? `/${facilityId}/mi-perfil/${user.id}` : `/mis-establecimientos` : `/usuario/${user.id}`}>
          <DropdownMenuItem className="cursor-pointer hover:bg-[hsl(var(--button-hover))] focus:bg-[hsl(var(--button-hover))]">
            <UserIcon className="mr-2 size-4" />
            Mi perfil
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          onClick={() => {
            queryClient.clear()
            logout()
          }}
          className="cursor-pointer hover:bg-[hsl(var(--button-hover))] focus:bg-[hsl(var(--button-hover))]"
        >
          <LogOutIcon className="mr-2 size-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
