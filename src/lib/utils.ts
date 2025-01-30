import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, differenceInYears } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatBirthday = (birthday: string) => {
  const date = new Date(birthday)
  const formattedDate = format(date, "dd/MM/yyyy")
  const age = differenceInYears(new Date(), date)
  return `${formattedDate} (${age} años)`
}

export const daysOfWeek = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"]
