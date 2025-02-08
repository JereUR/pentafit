import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { generateIdFromEntropySize } from "lucia"
import { OAuth2RequestError } from "arctic"

import { google, lucia } from "@/auth"
import kyInstance from "@/lib/ky"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")
  const state = req.nextUrl.searchParams.get("state")

  const cookieStore = await cookies()
  const storedState = cookieStore.get("state")?.value
  const storedCodeVerifier = cookieStore.get("code_verifier")?.value

  if (
    !code ||
    !state ||
    !storedState ||
    !storedCodeVerifier ||
    state !== storedState
  ) {
    console.error("Invalid request parameters")
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  try {
    const tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier,
    )

    const accessToken =
      typeof tokens.accessToken === "function"
        ? tokens.accessToken()
        : tokens.accessToken

    if (typeof accessToken !== "string") {
      throw new Error("Invalid access token format")
    }

    const googleUser = await kyInstance
      .get("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .json<{
        id: string
        name: string
        email: string
        given_name: string
        family_name: string
      }>()

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ googleId: googleUser.id }, { email: googleUser.email }],
      },
    })

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {})
      const sessionCookie = lucia.createSessionCookie(session.id)
      cookieStore.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      )
      return NextResponse.redirect(new URL("/", req.url))
    }

    const userId = generateIdFromEntropySize(10)

    await prisma.user.create({
      data: {
        id: userId,
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        email: googleUser.email,
        googleId: googleUser.id,
        role: "CLIENT",
        membershipLevel: "NONE",
        birthday: "",
        gender: "",
      },
    })

    const session = await lucia.createSession(userId, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    )

    return NextResponse.redirect(new URL("/", req.url))
  } catch (error) {
    console.error("Error during Google authentication:", error)
    if (error instanceof OAuth2RequestError) {
      return NextResponse.json(
        { error: "Invalid OAuth request", details: error.message },
        { status: 400 },
      )
    }
    console.error("Full error:", error instanceof Error ? error.stack : error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
