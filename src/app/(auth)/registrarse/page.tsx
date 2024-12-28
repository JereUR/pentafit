import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import signUpImage from "@/assets/login-image.webp"
import SignUpForm from "./SignUpForm"

export const metadata: Metadata = {
  title: "Registro",
  description:
    "Crea una cuenta para comenzar a administrar tus negocios",
}

export default function SignUpPage() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl"><Image
        src={signUpImage}
        alt="Imagen registro"
        className="hidden w-1/2 object-cover md:block"
      />
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Regístrate</h1>
            <p className="text-muted-foreground">
              Crea una cuenta para comenzar a administrar{" "}
              <span className="italic">tus</span> negocios
            </p>
          </div>
          <div className="space-y-5">
            <SignUpForm />
            <Link
              href="/iniciar-sesion"
              className="block text-center text-primary hover:text-primary/140 hover:underline"
            >
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>
          </div>
        </div>

      </div>
    </main>
  )
}