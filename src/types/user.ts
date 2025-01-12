import { MembershipLevel, Prisma } from "@prisma/client"

export const GENDER_OPTIONS = [
  { value: "Masculino", label: "Masculino" },
  { value: "Femenino", label: "Femenino" },
  { value: "Otros", label: "Otros" },
] as const

export const MEMBERSHIP_OPTIONS = [
  {
    level: MembershipLevel.STANDARD,
    price: 9.99,
    description:
      "Acceso básico a todas las prestaciones con hasta 1 establecimiento",
  },
  {
    level: MembershipLevel.PREMIUM,
    price: 19.99,
    description: "Posibilidad de contar con hasta 3 establecimientos",
  },
  {
    level: MembershipLevel.FULL,
    price: 29.99,
    description: "Posibilidad de contar con hasta 5 establecimientos",
  },
]

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
    facilities: {
      select: {
        facility: {
          select: {
            id: true,
            name: true,
            description: true,
            isActive: true,
            isWorking: true,
            logoUrl: true,
          },
        },
      },
    },
    createdAt: true,
  } satisfies Prisma.UserSelect
}

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>
}>
