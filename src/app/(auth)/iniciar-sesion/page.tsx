import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"

import LoginForm from "./LoginForm"
import loginImage from "@/assets/login-image.webp"
import logoImage from "@/assets/logo-full.webp"
import GoogleSignInButton from "./google/GoogleSignInButton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description:
    "Inicia sesión en filmbook para compartir tus películas favoritas y comentar.",
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 md:p-8">
      <Card className="flex h-full w-full max-w-4xl overflow-hidden rounded-lg shadow-xl">
        <div className="hidden md:block md:w-1/2">
          <Image
            src={loginImage}
            alt="Imagen inicio de sesión"
            className="h-full w-full object-cover"
          />
        </div>
        <CardContent className="flex flex-col justify-between w-full space-y-6 p-8 md:w-1/2">
          <CardHeader className="flex p-0">
            <CardTitle className="flex items-center justify-between gap-4">
              <div className="w-1/3">
                <Image src={logoImage} alt="Logo image" height={65} width={130} className="mx-auto" />
              </div>
              <div className="w-2/3 my-2 flex flex-col gap-4 mx-auto">
                <h1 className="text-3xl font-bold">Iniciar Sesión</h1></div></CardTitle>
          </CardHeader>

          <div className="space-y-6">
            <GoogleSignInButton />
            <div className="flex items-center my-6">
              <hr className="flex-grow border-t border-muted" />
              <span className="px-3 text-sm text-muted-foreground">ó</span>
              <hr className="flex-grow border-t border-muted" />
            </div>
            <LoginForm />
            <div className="flex justify-end">
              <Link
                href="/recuperar-contrasena"
                className="text-sm text-foreground/40 hover:text-primary/70 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex justify-center">
              <Link
                href="/registrarse"
                className="text-primary hover:text-primary/70 hover:underline"
              >
                ¿No tienes una cuenta? Regístrate!
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}