import { z } from "zod"

const requiredString = z.string().trim().min(1, "Requerido")

const RoleEnum = z.enum(["ADMIN", "DEFAULT", "STAFF"])

export type Role = z.infer<typeof RoleEnum>

export const signUpSchema = z.object({
  firstName: requiredString.regex(/^[a-zA-Z]+$/, "Solo se permite letras"),
  lastName: requiredString.regex(/^[a-zA-Z]+$/, "Solo se permite letras"),
  email: requiredString.email("Email inválido"),
  role: RoleEnum,
  gender: requiredString,
  birthday: requiredString,
  password: requiredString.min(8, "Debe tener como mínimo 8 caracteres"),
})

export type SignUpValues = z.infer<typeof signUpSchema>

export const loginSchema = z.object({
  email: requiredString.email("Email inválido"),
  password: requiredString,
})

export type LoginValues = z.infer<typeof loginSchema>
