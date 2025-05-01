"use server"

import { hash } from "@node-rs/argon2"
import { generateIdFromEntropySize } from "lucia"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect-error"

import prisma from "@/lib/prisma"
import { lucia } from "@/auth"
import { signUpSchema, SignUpValues } from "@/lib/validation"
import { Role } from "@prisma/client"

export async function signUp(
  credentials: SignUpValues,
): Promise<{ error: string }> {
  try {
    const { lastName, firstName, email, gender, birthday, password } =
      signUpSchema.parse(credentials)

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    })

    const userId = generateIdFromEntropySize(10)

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    })

    if (existingEmail) {
      return { error: "El email ingresado ya está en uso." }
    }

    await prisma.user.create({
      data: {
        id: userId,
        role:Role.ADMIN,
        firstName,
        lastName,
        gender,
        birthday,
        email,
        passwordHash,
      },
    })

    const session = await lucia.createSession(userId, {})
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
