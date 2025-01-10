import { MembershipLevel } from "@prisma/client"
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
