'use client'

import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import LoadingButton from "@/components/LoadingButton"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState<string>("")
  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setSuccess(true)
        toast({
          title: "Mail enviado",
          description: "Se ha enviado un correo electrónico con instrucciones para restablecer la contraseña"
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Ha ocurrido un error al enviar el correo electrónico"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-primary">¿Olvidaste tu contraseña?</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Ingresa tu correo electrónico y te enviaremos instrucciones para restablecerla.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <p className="text-center text-green-600">
            Se ha enviado un enlace a tu correo electrónico para restablecer tu contraseña.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
            />
            <LoadingButton
              loading={loading}
              type="submit"
              className="w-full"
              disabled={loading}
            >
              Enviar mail
            </LoadingButton>
          </form>
        )}
      </CardContent>
    </Card>
  )
}