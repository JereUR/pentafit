import { MembershipLevel, type Prisma } from "@prisma/client"
import { Allergy, ChronicCondition, Injury, Medication, UserHealthInfo } from "./health"

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
    role: true,
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

export interface UserClient {
  id: string
  firstName: string
  lastName: string
  email?: string | null
  avatarUrl: string | null
  hasChronicConditions: boolean
  chronicConditions?: ChronicCondition[]
  takingMedication: boolean
  medications?: Medication[]
  hasInjuries: boolean
  injuries?: Injury[]
  hasAllergies: boolean
  allergies?: Allergy[]
}

export interface UserAssigned {
  firstName: string
  lastName: string
  email?: string | null
}

export interface SimpleDiaryData {
  id: string
  name: string
  typeSchedule: string
  dateFrom: string | Date
  dateUntil: string | Date
  termDuration: number
  amountOfPeople: number
  isActive: boolean
  genreExclusive: string
  worksHolidays: boolean
  observations: string | null
  daysAvailable: {
    id?: string
    available: boolean
    timeStart: string
    timeEnd: string
  }[]
  repeatFor?: number | null
  facilityId?: string
  offerDays?: {
    isOffer: boolean
    discountPercentage: number | null
  }[]
}

export interface DiaryPlanData {
  id: string
  name: string
  daysOfWeek: boolean[]
  sessionsPerWeek: number
  vacancies: number
  planId: string
  activityId: string
  activity: {
    id: string
    name: string
    description: string | null
    activityType: string
  }
  diaries: SimpleDiaryData[]
}

export interface UserDiaryData {
  id: string
  userId: string
  diaryId: string
  isActive: boolean
  startDate: string | Date
  endDate: string | Date | null
  diary: SimpleDiaryData & {
    activity: {
      id: string
      name: string
      description: string | null
      activityType: string
    }
  }
  selectedDays?: {
    id: string
    timeStart: string
    timeEnd: string
  }[]
  diaryPlan?: {
    id: string
    name: string
    sessionsPerWeek: number
    daysOfWeek: boolean[]
  }
}

export default function formatUsersAssignedToString(
  users: UserAssigned[],
): string {
  if (!users || !users.length) return "Sin usuarios asignados"

  return users
    .map((user, index) => {
      return `${index + 1}- ${user.firstName} ${user.lastName} ${user.email && `(${user.email})`}`
    })
    .join("\n\n")
}

// CLIENT DATA

export interface Activity {
  name: string
  description: string | null
}

export interface DiaryPlan {
  id: string
  name: string
  daysOfWeek: boolean[]
  sessionsPerWeek: number
  vacancies: number
  activity: Activity
}

export interface Plan {
  id: string
  name: string
  price: number
  paymentTypes: string[]
  diaryPlans: DiaryPlan[]
}

export interface UserPlan {
  plan: Plan
}

export interface UserMeasurement {
  id: string
  date: Date
  weight?: number | null
  height?: number | null
  bodyFat?: number | null
  muscle?: number | null
  chest?: number | null
  waist?: number | null
  hips?: number | null
  arms?: number | null
  thighs?: number | null
  notes?: string | null
}

export interface ClientUserProfileData {
  id: string
  firstName: string
  lastName: string
  email: string | null
  birthday: string
  avatarUrl: string | null
  gender: string
  plan: UserPlan[]
  createdAt: Date
  measurements?: UserMeasurement[]
  healthInfo?: UserHealthInfo
}

export interface UserClientWithPlan extends UserClient {
  plan: {
    id: string
    name: string
    price: number
  }
}
