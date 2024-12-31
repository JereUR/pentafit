import { Metadata } from "next"
import ForgotPasswordForm from "./ForgotPasswordForm"

export const metadata: Metadata = {
  title: "Olvidé mi contraseña",
  description: "Solicita un enlace para restablecer tu contraseña.",
}

export default function ForgotPasswordPage() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <ForgotPasswordForm />
    </main>
  )
}
