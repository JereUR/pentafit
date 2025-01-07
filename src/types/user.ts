import { MembershipLevel } from "@prisma/client"

export const GENDER_OPTIONS = [
  { value: "Masculino", label: "Masculino" },
  { value: "Femenino", label: "Femenino" },
  { value: "Otros", label: "Otros" },
] as const

export interface UserProfileData {
  id: string
  firstName: string
  lastName: string
  email: string | null
  gender: string
  birthday: string
  avatarUrl: string | null
  membershipLevel: MembershipLevel
}
