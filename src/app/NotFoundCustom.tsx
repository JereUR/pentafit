"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { ArrowLeft, Home } from "lucide-react"

import { Button } from "@/components/ui/button"
import logoFull from "@/assets/logo-full.webp"
import { Role } from "@prisma/client"

interface NotFoundCustomProps {
  role: string
  isLoggedIn: boolean
}

export default function NotFoundCustom({
  role,
  isLoggedIn,
}: NotFoundCustomProps) {
  const [isClient, setIsClient] = useState(false)
  const [backPath, setBackPath] = useState("/")

  useEffect(() => {
    if (role === Role.CLIENT) {
      setIsClient(true)
      setBackPath("/mis-establecimientos")
    } else {
      setIsClient(false)
      setBackPath("/panel-de-control")
    }
  }, [role])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-background">
      <div className="max-w-md space-y-8">
        <div className="space-y-2">
          <h1 className="text-7xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold">Página no encontrada</h2>
          <p className="text-muted-foreground">Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {isLoggedIn && (
              <Button variant="outline" asChild className="gap-2">
                <Link href={backPath}>
                  <ArrowLeft className="h-4 w-4" />
                  {isClient ? "Mis Establecimientos" : "Panel de Control"}
                </Link>
              </Button>
            )}

            <Button asChild className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                Inicio
              </Link>
            </Button>
          </div>
        </div>

        <div className="pt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center">
              <div className="bg-background px-4">
                <Image
                  src={logoFull || "/placeholder.svg"}
                  alt="Pentafit Logo"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
