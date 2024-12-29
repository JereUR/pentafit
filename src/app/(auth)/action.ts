"use server"

import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"

import { lucia, validateRequest } from "@/auth"

export async function logout() {
  const { session } = await validateRequest()

  if (!session) {
    throw new Error("No autorizado.")
  }

  await lucia.invalidateSession(session.id)

  const sessionCookie = lucia.createBlankSessionCookie()

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

  const headersList = await headers()
  const currentPath = headersList.get("x-invoke-path") || "/"

  if (currentPath !== "/") {
    redirect("/iniciar-sesion")
  }
}
