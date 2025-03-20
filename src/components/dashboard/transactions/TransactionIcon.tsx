import { Calendar, ClipboardList, Copy, Users, SquareActivity, UserCheck, UserX } from "lucide-react"

import { PlanIcon } from "@/config/icons"
import { TransactionType } from "@/types/transactions"

interface TransactionIconProps {
  type: TransactionType
  className?: string
}

export function TransactionIcon({ type, className = "h-4 w-4" }: TransactionIconProps) {
  if (type.includes("ACTIVITY")) {
    return <ClipboardList className={`${className} text-purple-400`} />
  }
  if (type.includes("STAFF") || type.includes("CLIENT")) {
    return <Users className={`${className} text-cyan-400`} />
  }
  if (type.includes("PLAN")) {
    return <PlanIcon className={`${className} text-amber-400`} />
  }
  if (type.includes("DIARY")) {
    return <Calendar className={`${className} text-emerald-400`} />
  }
  if (type === TransactionType.ASSIGN_ROUTINE_USER) {
    return <UserCheck className={`${className} text-blue-400`} />
  }
  if (type === TransactionType.UNASSIGN_ROUTINE_USER) {
    return <UserX className={`${className} text-red-400`} />
  }
  if (type === TransactionType.ROUTINE_CONVERTED_TO_PRESET) {
    return <Copy className={`${className} text-violet-400`} />
  }
  if (type.includes("ROUTINE") && !type.includes("PRESET")) {
    return <SquareActivity className={`${className} text-lime-500`} />
  }
  if (type.includes("PRESET_ROUTINE")) {
    return <SquareActivity className={`${className} text-indigo-500`} />
  }
  return null
}

