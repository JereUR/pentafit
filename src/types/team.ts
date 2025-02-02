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

export interface RoleSelectType {
  value: Role
  description: string
}

export const rolesSelect: RoleSelectType[] = [
  {
    value: Role.SUPER_ADMIN,
    description:
      "Permite realizar cualquier acción dentro del area de trabajo, así como ver reportes y estadisticas varias.",
  },
  {
    value: Role.ADMIN,
    description:
      "Permite realizar la mayoría de las acciones dentro del area de trabajo salvo el apartado de 'Establecimientos' y ver reportes y estadísticas varias.",
  },
  {
    value: Role.STAFF,
    description:
      "Permite realizar solo tareas relacionadas con la administración de clientes, tales como actividades, rutinas, planes nutricionales, etc.",
  },
  { value: Role.CLIENT, description: "Cliente del establecimiento" },
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

export type TeamExportData = {
  firstName: string
  lastName: string
  email: string
  birthday: string
  gender: string
  role: Role
  facilities: string
}

export const formatFacilities = (
  facilities: {
    facility: {
      id: string
      name: string
      logoUrl: string | null
    }
  }[],
): string => {
  return facilities
    .map((facility) => {
      return facility.facility.name
    })
    .join(" - ")
}
