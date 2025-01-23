import { Role } from "@prisma/client"

export const columnsTeam: { key: keyof TeamData; label: string }[] = [
  { key: "firstName", label: "Nombre" },
  { key: "lastName", label: "Apellido" },
  { key: "email", label: "Correo electrónico" },
  { key: "birthday", label: "Cumpleaños" },
  { key: "gender", label: "Género" },
  { key: "role", label: "Puesto" },
  { key: "avatarUrl", label: "Foto de perfil" },
  { key: "facilities", label: "Establecimientos" },
]

export type TeamData = {
  id: string
  firstName: string
  lastName: string
  email: string
  birthday: Date
  gender: string
  role: Role
  avatarUrl: string
  facilities: {
    id: string
    name: string
    logoUrl: string
  }[]
  facilityId: string
}
