"use server"

import { verify } from "@node-rs/argon2"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect-error"

import prisma from "@/lib/prisma"
import { lucia } from "@/auth"
import { loginSchema, LoginValues } from "@/lib/validation"

export async function login(
  credentials: LoginValues,
): Promise<{ error: string }> {
  try {
    const { email, password } = loginSchema.parse(credentials)

    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    })

    if (!existingUser || !existingUser.passwordHash) {
      return { error: "Credenciales incorrectas." }
    }

    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    })

    if (!validPassword) {
      return { error: "Credenciales incorrectas." }
    }

    const session = await lucia.createSession(existingUser.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)

    const cookieStore = await cookies()
    cookieStore.set({
      name: sessionCookie.name,
      value: sessionCookie.value,
      path: sessionCookie.attributes.path || "/",
      httpOnly: sessionCookie.attributes.httpOnly,
      secure: sessionCookie.attributes.secure,
      sameSite: sessionCookie.attributes.sameSite as "strict" | "lax" | "none",
      maxAge: sessionCookie.attributes.maxAge || 0,
    })

    redirect("/")
  } catch (error) {
    if (isRedirectError(error)) throw error
    console.error(error)
    return {
      error: "Algo ocurrió mal. Por favor intenta nuevamente.",
    }
  }
}
