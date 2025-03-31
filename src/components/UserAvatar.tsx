import Image from "next/image"

import avatarPlaceholder from "@/assets/avatar-placeholder.png"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  avatarUrl: string | null | undefined
  size?: number
  className?: string
  primaryColor?: string
}

export default function UserAvatar({
  avatarUrl,
  size,
  className,
  primaryColor
}: UserAvatarProps) {
  console.log(primaryColor)
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Image
        src={avatarUrl || avatarPlaceholder}
        alt="Avatar de usuario"
        width={size ?? 32}
        height={size ?? 32}
        className={cn(
          "aspect-square flex-none rounded-full bg-secondary object-cover",
          primaryColor ? `ring-[${primaryColor}] ring-2` : "ring-primary ring-1",
          className
        )}
      />
    </div>
  )
}
