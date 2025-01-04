import { getUserNamesById } from "@/lib/users"
import { Metadata } from "next"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const id = (await params).id

  try {
    const user = await getUserNamesById(id)

    if (!user) {
      return {
        title: "Usuario no encontrado",
      }
    }

    return {
      title: `${user.firstName} ${user.lastName}`,
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Error al cargar el usuario",
    }
  }
}

export default function UserPage() {
  return <div>UserPage</div>
}
