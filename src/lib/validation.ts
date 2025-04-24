import {
  genreExclusive,
  MembershipLevel,
  NotificationType,
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

export const notificationSchema = z.object({
  recipientId: z.string().uuid("ID de destinatario inválido"),
  issuerId: z.string().uuid("ID de emisor inválido"),
  facilityId: z.string().uuid("ID de establecimiento inválido"),
  type: z.nativeEnum(NotificationType),
  activityId: z.string().uuid("ID de actividad inválido").optional(),
  planId: z.string().uuid("ID de plan inválido").optional(),
  diaryId: z.string().uuid("ID de agenda inválido").optional(),
  userId: z.string().uuid("ID de usuario inválido").optional(),
  read: z.boolean().default(false),
})

export type NotificationValues = z.infer<typeof notificationSchema>

export const replicateActionSchema = z.object({
  ids: z.array(z.string().uuid()),
  targetFacilityIds: z.array(z.string().uuid()),
  issuerId: z.string().uuid("ID de emisor inválido"),
})

export type ReplicateActionValues = z.infer<typeof replicateActionSchema>

// Facility

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

// Activity

export const activitySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional().nullable(),
  price: z.union([z.number().min(0), z.string()]).transform((val) => {
    const parsed = Number.parseFloat(val as string)
    return isNaN(parsed) ? 0 : parsed
  }),
  isPublic: z.boolean().default(false),
  publicName: z.string().optional().nullable(),
  generateInvoice: z.boolean().default(false),
  maxSessions: z.union([z.number().min(1), z.string()]).transform((val) => {
    const parsed = Number.parseInt(val as string, 10)
    return isNaN(parsed) ? 1 : parsed
  }),
  mpAvailable: z.boolean().default(false),
  startDate: z.date(),
  endDate: z.date(),
  paymentType: z.string().min(1, "El tipo de pago es requerido"),
  activityType: z.string().min(1, "El tipo de actividad es requerido"),
  facilityId: z.string().uuid("ID de establecimiento inválido"),
  staffIds: z.array(z.string()).default([]),
})

export type ActivityValues = z.infer<typeof activitySchema>

// User membership

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

// Plan

export const planSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string(),
  price: z.union([z.number().min(0), z.string()]).transform((val) => {
    const parsed = Number.parseFloat(val as string)
    return isNaN(parsed) ? 0 : parsed
  }),
  startDate: z.string().refine((dateString) => !isNaN(Date.parse(dateString)), {
    message: "Fecha de inicio inválida",
  }),
  endDate: z.string().refine((dateString) => !isNaN(Date.parse(dateString)), {
    message: "Fecha de fin inválida",
  }),
  expirationPeriod: z.number().int().min(0),
  generateInvoice: z.boolean().default(false),
  paymentTypes: z
    .array(z.nativeEnum(PaymentType))
    .min(1, "Selecciona mínimo una modalidad de cobro"),
  planType: z.nativeEnum(PlanType),
  freeTest: z.boolean().default(false),
  current: z.boolean().default(false),
  diaryPlans: z.array(
    z
      .object({
        name: requiredString,
        daysOfWeek: z.array(z.boolean()).length(7),
        sessionsPerWeek: z.number().int().min(1),
        vacancies: z.number().int().min(1),
        activityId: z.string().uuid("ID de actividad inválido"),
      })
      .refine(
        (data) => {
          const selectedDays = data.daysOfWeek.filter(Boolean).length
          return data.sessionsPerWeek <= selectedDays
        },
        {
          message:
            "El número de sesiones por semana no puede ser mayor que la cantidad de días seleccionados",
          path: ["sessionsPerWeek"],
        },
      ),
  ),
  facilityId: z.string().uuid("ID de establecimiento inválido"),
})

export type PlanValues = z.infer<typeof planSchema>

// Diary

const dayAvailableSchema = z.object({
  available: z.boolean(),
  timeStart: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido"),
  timeEnd: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido"),
})

const offerDaySchema = z.object({
  isOffer: z.boolean(),
  discountPercentage: z.number().min(0).max(100).nullable(),
})

export const diarySchema = z
  .object({
    facilityId: z.string().uuid("ID de establecimiento inválido"),
    activityId: z.string().uuid("ID de actividad inválido"),
    name: z.string().min(1, "El nombre es requerido"),
    typeSchedule: z.nativeEnum(typeSchedule),
    dateFrom: z.date(),
    dateUntil: z.date(),
    repeatFor: z.number().int().min(0).nullable(),
    offerDays: z
      .array(offerDaySchema)
      .length(
        7,
        "Debe proporcionar información de oferta para los 7 días de la semana",
      ),
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
      .length(
        7,
        "Debe proporcionar disponibilidad para los 7 días de la semana",
      ),
  })
  .refine((data) => data.daysAvailable.some((day) => day.available), {
    message: "Al menos un día debe estar marcado como disponible",
    path: ["daysAvailable"],
  })

export type DiaryValues = z.infer<typeof diarySchema>

// Routine

export const exerciseSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  bodyZone: z.string().min(1, "La zona del cuerpo es requerida"),
  series: z.number().min(1, "Las series deben ser al menos 1"),
  count: z.number().min(1, "La cantidad debe ser al menos 1"),
  measure: z.string().min(1, "La medida es requerida"),
  rest: z.number().nullable(),
  description: z.string().nullable(),
  photoUrl: z.string().nullable(),
})

export const dailyExercisesSchema = z.object({
  MONDAY: z.array(exerciseSchema).default([]),
  TUESDAY: z.array(exerciseSchema).default([]),
  WEDNESDAY: z.array(exerciseSchema).default([]),
  THURSDAY: z.array(exerciseSchema).default([]),
  FRIDAY: z.array(exerciseSchema).default([]),
  SATURDAY: z.array(exerciseSchema).default([]),
  SUNDAY: z.array(exerciseSchema).default([]),
})

export const routineSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  facilityId: z.string().min(1, "La instalación es requerida"),
  dailyExercises: dailyExercisesSchema.default({
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: [],
  }),
})

export type ExerciseValues = z.infer<typeof exerciseSchema>
export type RoutineValues = z.infer<typeof routineSchema>
export type DailyExercisesValues = z.infer<typeof dailyExercisesSchema>

export const userRoutineSchema = z.object({
  userId: z.string().min(1, "El usuario es requerido"),
  routineId: z.string().min(1, "La rutina es requerida"),
  dayOfWeek: z.enum(
    [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ],
    {
      required_error: "El día de la semana es requerido",
    },
  ),
  isActive: z.boolean().default(true),
})

export type UserRoutineValues = z.infer<typeof userRoutineSchema>

// Nutritional plan

export const foodItemSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  portion: z.number().min(0, "La porción debe ser un número positivo"),
  unit: z.string().min(1, "La unidad es requerida"),
  calories: z.number().nullable(),
  protein: z.number().nullable(),
  carbs: z.number().nullable(),
  fat: z.number().nullable(),
  notes: z.string().nullable(),
})

export const mealSchema = z.object({
  mealType: z.enum(
    [
      "BREAKFAST",
      "PRE_WORKOUT",
      "LUNCH",
      "SNACK",
      "DINNER",
      "POST_WORKOUT",
      "OTHER",
    ],
    {
      required_error: "El tipo de comida es requerido",
    },
  ),
  time: z.string().nullable(),
  foodItems: z.array(foodItemSchema).default([]),
})

export const dailyMealsSchema = z.object({
  MONDAY: z.array(mealSchema).default([]),
  TUESDAY: z.array(mealSchema).default([]),
  WEDNESDAY: z.array(mealSchema).default([]),
  THURSDAY: z.array(mealSchema).default([]),
  FRIDAY: z.array(mealSchema).default([]),
  SATURDAY: z.array(mealSchema).default([]),
  SUNDAY: z.array(mealSchema).default([]),
})

export const nutritionalPlanSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  facilityId: z.string().min(1, "La instalación es requerida"),
  dailyMeals: dailyMealsSchema.default({
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: [],
  }),
})

export const nutritionalPlanSubmitSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  facilityId: z.string().min(1, "La instalación es requerida"),
  dailyMeals: z
    .object({
      MONDAY: z.array(mealSchema),
      TUESDAY: z.array(mealSchema),
      WEDNESDAY: z.array(mealSchema),
      THURSDAY: z.array(mealSchema),
      FRIDAY: z.array(mealSchema),
      SATURDAY: z.array(mealSchema),
      SUNDAY: z.array(mealSchema),
    })
    .refine(
      (dailyMeals) => {
        const hasMeals = Object.values(dailyMeals).some(
          (meals) => meals.length > 0,
        )
        if (!hasMeals) return false

        return Object.values(dailyMeals).every(
          (meals) =>
            meals.length === 0 ||
            meals.every((meal) => meal.foodItems.length > 0),
        )
      },
      {
        message: "Cada comida debe tener al menos un alimento",
        path: ["dailyMeals"],
      },
    ),
})

export type FoodItemValues = z.infer<typeof foodItemSchema>
export type MealValues = z.infer<typeof mealSchema>
export type DailyMealsValues = z.infer<typeof dailyMealsSchema>
export type NutritionalPlanValues = z.infer<typeof nutritionalPlanSchema>

export const userNutritionalPlanSchema = z.object({
  userId: z.string().min(1, "El usuario es requerido"),
  nutritionalPlanId: z.string().min(1, "El plan nutricional es requerido"),
  isActive: z.boolean().default(true),
  startDate: z.date().default(() => new Date()),
  endDate: z.date().nullable(),
})

export type UserNutritionalPlanValues = z.infer<
  typeof userNutritionalPlanSchema
>

// Measurement

export const measurementFormSchema = z.object({
  weight: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseFloat(val) : undefined)),
  height: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseFloat(val) : undefined)),
  bodyFat: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseFloat(val) : undefined)),
  muscle: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseFloat(val) : undefined)),
  chest: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseFloat(val) : undefined)),
  waist: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseFloat(val) : undefined)),
  hips: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseFloat(val) : undefined)),
  arms: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseFloat(val) : undefined)),
  thighs: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseFloat(val) : undefined)),
  notes: z.string().optional(),
})

export type MeasurementFormValues = z.infer<typeof measurementFormSchema>

// Health Info

export const chronicConditionSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  diagnosisDate: z.string().optional(),
  severity: z.enum(["MILD", "MODERATE", "SEVERE"], {
    errorMap: () => ({ message: "Selecciona una severidad válida" }),
  }),
  notes: z.string().optional(),
})

export const medicationSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  dosage: z.string().min(1, "La dosis es requerida"),
  frequency: z.string().min(1, "La frecuencia es requerida"),
  purpose: z.string().optional(),
})

export const injurySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  bodyPart: z.string().min(1, "La parte del cuerpo es requerida"),
  dateOccurred: z.string().optional(),
  affectsExercise: z.boolean(),
  exerciseRestrictions: z.string().optional(),
  severity: z.enum(["MILD", "MODERATE", "SEVERE"], {
    errorMap: () => ({ message: "Selecciona una severidad válida" }),
  }),
})

export const allergySchema = z.object({
  allergen: z.string().min(1, "El alérgeno es requerido"),
  reaction: z.string().min(1, "La reacción es requerida"),
  severity: z.enum(["MILD", "MODERATE", "SEVERE"], {
    errorMap: () => ({ message: "Selecciona una severidad válida" }),
  }),
})

export const healthInfoSchema = z.object({
  userId: z.string().min(1,"ID de usuario inválido"),
  facilityId: z.string().uuid("ID de establecimiento inválido"),
  hasChronicConditions: z.boolean(),
  chronicConditions: z.array(chronicConditionSchema).optional(),
  takingMedication: z.boolean(),
  medications: z.array(medicationSchema).optional(),
  hasInjuries: z.boolean(),
  injuries: z.array(injurySchema).optional(),
  hasAllergies: z.boolean(),
  allergies: z.array(allergySchema).optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  medicalNotes: z.string().optional(),
})

export type HealthInfoValues = z.infer<typeof healthInfoSchema>
export type ChronicConditionValues = z.infer<typeof chronicConditionSchema>
export type MedicationValues = z.infer<typeof medicationSchema>
export type InjuryValues = z.infer<typeof injurySchema>
export type AllergyValues = z.infer<typeof allergySchema>

// Payment

export const PaymentValuesSchema = z.object({
  userId: z.string().uuid(),
  planId: z.string().uuid(),
  amount: z.number().positive(),
  status: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]).optional().default("PENDING"),
  paymentMonth: z.string().regex(/^\d{4}-\d{2}$/, "Invalid payment month format (YYYY-MM)"),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
})

export type PaymentValues = z.infer<typeof PaymentValuesSchema>

// Invoice

export const InvoiceValuesSchema = z.object({
  userId: z.string().uuid(),
  planId: z.string().uuid(),
  amount: z.number().positive(),
  status: z.enum(["PENDING", "PAID", "CANCELED", "OVERDUE"]).optional().default("PENDING"),
  dueDate: z.date(),
  period: z.string().regex(/^\d{4}-\d{2}$/, "Invalid period format (YYYY-MM)"),
  notes: z.string().optional(),
})

export type InvoiceValues = z.infer<typeof InvoiceValuesSchema>