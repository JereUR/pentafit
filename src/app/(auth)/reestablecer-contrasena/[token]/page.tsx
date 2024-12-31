import { Metadata } from "next"

import ResetPasswordForm from "../ResetPasswordForm"

export const metadata: Metadata = {
  title: "Reestablecer contraseña",
  description: "Restablece tu contraseña.",
}

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <ResetPasswordForm token={params.token} />
    </main>
  )
}
