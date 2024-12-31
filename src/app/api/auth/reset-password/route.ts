import { hash } from "@node-rs/argon2"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  const { token, password } = await req.json()

  const resetToken = await prisma.resetToken.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!resetToken || resetToken.expiresAt < new Date()) {
    return new Response(
      JSON.stringify({ error: "El token es inválido o ha expirado." }),
      { status: 400 },
    )
  }

  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  })

  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { passwordHash },
  })

  await prisma.resetToken.delete({ where: { id: resetToken.id } })

  return new Response(null, { status: 200 })
}
