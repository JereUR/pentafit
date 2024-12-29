import { google } from "@/auth"

import { generateCodeVerifier, generateState } from "arctic"
import { NextResponse } from "next/server"

export async function GET() {
  const state = generateState()
  const codeVerifier = generateCodeVerifier()

  const url = google.createAuthorizationURL(state, codeVerifier, [
    "profile",
    "email",
  ])

  const response = NextResponse.redirect(url)

  response.cookies.set("state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  })

  response.cookies.set("code_verifier", codeVerifier, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  })

  return response
}
