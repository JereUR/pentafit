import Image from "next/image"

import avatarPlaceholder from "@/assets/avatar-placeholder.png"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  avatarUrl: string | null | undefined
  size?: number
  className?: string
}

export default function UserAvatar({
  avatarUrl,
  size,
  className,
}: UserAvatarProps) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Image
        src={avatarUrl || avatarPlaceholder}
        alt="Avatar de usuario"
        width={size ?? 32}
        height={size ?? 32}
        className={cn("aspect-square flex-none rounded-full bg-secondary object-cover ring-1 ring-primary", className)}
      />
    </div>
  )
}
