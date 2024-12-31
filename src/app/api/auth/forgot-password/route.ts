import { randomUUID } from "crypto"

import prisma from "@/lib/prisma"
import { sendEmail } from "@/lib/email"

export async function POST(req: Request) {
  const { email } = await req.json()

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return new Response(
      JSON.stringify({ error: "El correo electrónico no está registrado." }),
      { status: 404 },
    )
  }

  const token = randomUUID()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60)

  await prisma.resetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  })

  await sendEmail(
    email,
    "Restablece tu contraseña",
    `Hola, haz clic en el siguiente enlace para restablecer tu contraseña: ${process.env.BASE_URL}/reestablecer-contrasena/${token}`,
  )

  return new Response(null, { status: 200 })
}
