import React, { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

import { Input, InputProps } from "./ui/input"
import { cn } from "@/lib/utils"

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState<boolean>(false)

    return (
      <div className="relative">
        <Input
          className={cn("pe-10", className)}
          type={showPassword ? "text" : "password"}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          title={showPassword ? "Esconder contraseña" : "Mostrar contraseña"}
          className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground"
        >
          {showPassword ? (
            <EyeOff className="size-5" />
          ) : (
            <Eye className="size-5" />
          )}
        </button>
      </div>
    )
  },
)

PasswordInput.displayName = "PasswordInput"

export { PasswordInput }