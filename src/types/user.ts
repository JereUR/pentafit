import { Prisma } from "@prisma/client"

export const GENDER_OPTIONS = [
  { value: "Masculino", label: "Masculino" },
  { value: "Femenino", label: "Femenino" },
  { value: "Otros", label: "Otros" },
] as const

export function getUserDataSelect() {
  return {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    gender: true,
    birthday: true,
    avatarUrl: true,
    membershipLevel: true,
    createdAt: true,
  } satisfies Prisma.UserSelect
}

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>
}>
