import {
  genreExclusive,
  MembershipLevel,
  PaymentType,
  PlanType,
  Role,
  typeSchedule,
} from "@prisma/client"
import { z } from "zod"

const requiredString = z.string().trim().min(1, "Este campo es requerido")

export const signUpSchema = z
  .object({
    firstName: requiredString.min(1, "El nombre es requerido"),
    lastName: requiredString.min(1, "El apellido es requerido"),
    email: requiredString.email("El correo electrónico es inválido"),
    gender: z.enum(["Masculino", "Femenino", "Otros"], {
      errorMap: () => ({ message: "Selecciona un género válido" }),
    }),
    birthday: z
      .string({
        required_error: "La fecha de nacimiento es requerida",
        invalid_type_error: "Formato de fecha inválido",
      })
      .refine(
        (date) => {
          return !isNaN(Date.parse(date))
        },
        {
          message: "Formato de fecha inválido",
        },
      ),
    password: requiredString.min(
      8,
      "La contraseña debe tener al menos 8 caracteres",
    ),
    confirmPassword: requiredString,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export type SignUpValues = z.infer<typeof signUpSchema>

export const loginSchema = z.object({
  email: requiredString.email("El correo electrónico es inválido"),
  password: requiredString,
})

export type LoginValues = z.infer<typeof loginSchema>

export const updateUserProfileSchema = z.object({
  firstName: z.string().min(1, "Nombre es requerido"),
  lastName: z.string().min(1, "Apellido es requerido"),
  gender: z.enum(["Masculino", "Femenino", "Otros"]),
  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato invalido"),
})

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>

export const membershipUpdateSchema = z.object({
  membershipLevel: z.nativeEnum(MembershipLevel),
  cardNumber: z.string().regex(/^\d{16}$/, "Número de tarjeta inválido"),
  holder: z
    .string()
    .min(1, "Nombre y apellido de titular de tarjeta requerido"),
  expirationDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Fecha de expiración inválida"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV inválido"),
})

export type MembershipUpdateValues = z.infer<typeof membershipUpdateSchema>

export const facilitySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  address: z.string().optional(),
  phone: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  logoUrl: z.string().optional(),
  metadata: z
    .object({
      title: z.string().optional(),
      slogan: z.string().optional(),
      primaryColor: z.string().optional(),
      secondaryColor: z.string().optional(),
      thirdColor: z.string().optional(),
      logoWebUrl: z.string().optional(),
    })
    .optional(),
})

export type FacilityValues = z.infer<typeof facilitySchema>

export const activitySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional().nullable(),
  price: z.union([z.number().min(0), z.string()]).transform((val) => {
    const parsed = parseFloat(val as string)
    return isNaN(parsed) ? 0 : parsed
  }),
  isPublic: z.boolean().default(false),
  publicName: z.string().optional().nullable(),
  generateInvoice: z.boolean().default(false),
  maxSessions: z.union([z.number().min(1), z.string()]).transform((val) => {
    const parsed = parseInt(val as string, 10)
    return isNaN(parsed) ? 1 : parsed
  }),
  mpAvailable: z.boolean().default(false),
  startDate: z.date(),
  endDate: z.date(),
  paymentType: z.string().min(1, "El tipo de pago es requerido"),
  activityType: z.string().min(1, "El tipo de actividad es requerido"),
  facilityId: z.string().uuid("ID de establecimiento inválido"),
})

export type ActivityValues = z.infer<typeof activitySchema>

export const memberSchema = z
  .object({
    firstName: requiredString.min(1, "El nombre es requerido"),
    lastName: requiredString.min(1, "El apellido es requerido"),
    email: requiredString.email("El correo electrónico es inválido"),
    gender: requiredString,
    birthday: z
      .string({
        required_error: "La fecha de nacimiento es requerida",
        invalid_type_error: "Formato de fecha inválido",
      })
      .refine(
        (date) => {
          return !isNaN(Date.parse(date))
        },
        {
          message: "Formato de fecha inválido",
        },
      ),
    role: z.enum([Role.SUPER_ADMIN, Role.ADMIN, Role.STAFF, Role.CLIENT]),
    password: requiredString.min(
      8,
      "La contraseña debe tener al menos 8 caracteres",
    ),
    avatarUrl: z
      .string()
      .url("La URL del avatar debe ser válida")
      .nullable()
      .default(null),
    confirmPassword: requiredString,
    facilities: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        logoUrl: z.string().optional(),
      }),
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export type MemberValues = z.infer<typeof memberSchema>

export const updateMemberSchema = z.object({
  firstName: requiredString.min(1, "El nombre es requerido"),
  lastName: requiredString.min(1, "El apellido es requerido"),
  email: requiredString.email("El correo electrónico es inválido"),
  gender: requiredString,
  birthday: z
    .string({
      required_error: "La fecha de nacimiento es requerida",
      invalid_type_error: "Formato de fecha inválido",
    })
    .refine(
      (date) => {
        return !isNaN(Date.parse(date))
      },
      {
        message: "Formato de fecha inválido",
      },
    ),
  role: z.enum([Role.SUPER_ADMIN, Role.ADMIN, Role.STAFF, Role.CLIENT]),
  avatarUrl: z
    .string()
    .url("La URL del avatar debe ser válida")
    .nullable()
    .default(null),
  facilities: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      logoUrl: z.string().optional(),
    }),
  ),
})

export type UpdateMemberValues = z.infer<typeof updateMemberSchema>

export const planSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string(),
  price: z.union([z.number().min(0), z.string()]).transform((val) => {
    const parsed = parseFloat(val as string)
    return isNaN(parsed) ? 0 : parsed
  }),
  startDate: z.date(),
  endDate: z.date(),
  expirationPeriod: z.number().int().min(0),
  generateInvoice: z.boolean().default(false),
  paymentTypes: z
    .array(z.nativeEnum(PaymentType))
    .min(1, "Selecciona mínimo una modalidad de cobro"),
  planType: z.nativeEnum(PlanType),
  freeTest: z.boolean().default(false),
  current: z.boolean().default(false),
  diaryPlans: z.array(
    z.object({
      name: z.string(),
      daysOfWeek: z.array(z.boolean()).length(7),
      sessionsPerWeek: z.number().int().min(1),
      activityId: z.string().uuid("ID de actividad inválido"),
    }),
  ),
  facilityId: z.string().uuid("ID de establecimiento inválido"),
})

export type PlanValues = z.infer<typeof planSchema>

const dayAvailableSchema = z.object({
  available: z.boolean(),
  timeStart: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido"),
  timeEnd: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido"),
})

export const diarySchema = z.object({
  facilityId: z.string().uuid("ID de establecimiento inválido"),
  activityId: z.string().uuid("ID de actividad inválido"),
  name: z.string().min(1, "El nombre es requerido"),
  typeSchedule: z.nativeEnum(typeSchedule),
  dateFrom: z.date(),
  dateUntil: z.date(),
  repeatFor: z.number().int().min(0).nullable(),
  offerDays: z.array(z.boolean()).length(7),
  termDuration: z
    .number()
    .int()
    .positive("La duración del turno debe ser positiva"),
  amountOfPeople: z
    .number()
    .int()
    .positive("La cantidad de personas debe ser positiva"),
  isActive: z.boolean(),
  genreExclusive: z.nativeEnum(genreExclusive),
  worksHolidays: z.boolean(),
  observations: z.string().nullable(),
  daysAvailable: z
    .array(dayAvailableSchema)
    .length(7, "Debe proporcionar disponibilidad para los 7 días de la semana"),
})

export type DiaryValues = z.infer<typeof diarySchema>
