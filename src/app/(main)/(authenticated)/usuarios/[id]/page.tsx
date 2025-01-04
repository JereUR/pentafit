import { getUserNamesById } from "@/lib/users"
import { Metadata } from "next"

export async function generateMetadata(
  context: { params: { id: string } }
): Promise<Metadata> {
  const { params } = context
  const { id } = await params

  try {
    const user = await getUserNamesById(id)

    if (!user) {
      return {
        title: "Usuario no encontrado"
      }
    }

    return {
      title: `${user.firstName} ${user.lastName}`
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Error al cargar el usuario"
    }
  }
}

export default function UserPage() {
  return (
    <div>UserPage</div>
  )
}