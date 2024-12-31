'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from 'lucide-react'

import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import LoadingButton from "@/components/LoadingButton"
import { useToast } from "@/hooks/use-toast"

interface ResetPasswordFormProps {
  token: string
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: "Las contraseñas no coinciden",
      })
      return
    }
    setLoading(true)

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error || "Error al restablecer la contraseña.")
      }

      toast({
        title: "Contraseña restablecida con éxito",
        description: "Serás redirigido a la página de inicio de sesión.",
      })
      setTimeout(() => router.push("/iniciar-sesion"), 2000)
    } catch (err) {
      toast({
        variant: 'destructive',
        title: `${err instanceof Error ? err.message : "Error al restablecer la contraseña."}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-primary">Restablecer contraseña</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nueva contraseña"
              className="w-full pr-10"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          <Input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar contraseña"
            className="w-full"
            required
          />
          <LoadingButton
            loading={loading}
            type="submit"
            className="w-full"
            disabled={loading}
          >
            Restablecer
          </LoadingButton>
        </form>
      </CardContent>
    </Card>
  )
}