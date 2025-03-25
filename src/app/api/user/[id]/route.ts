import { NextRequest, NextResponse } from "next/server"
import { getUserNamesById } from "@/lib/users"
import { validateRequest } from "@/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user: loggedUser } = await validateRequest()

    if (!loggedUser) {
      return Response.json({ error: "No autorizado." }, { status: 401 })
    }

    const id = (await params).id
    const user = await getUserNamesById(id)

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: "Error al cargar el usuario" },
      { status: 500 },
    )
  }
}
