import { TransactionType } from "@/types/transactions"

interface TransactionBadgeProps {
  type: TransactionType
}

export function TransactionBadge({ type }: TransactionBadgeProps) {
  if (type.includes("CREATED")) {
    return <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-500">Creado</span>
  }
  if (type.includes("UPDATED")) {
    return <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-500">Actualizado</span>
  }
  if (type.includes("DELETED")) {
    return <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-500">Eliminado</span>
  }
  if (type.includes("REPLICATED")) {
    return <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-500">Replicado</span>
  }
  if (
    type === TransactionType.ASSIGN_ROUTINE_USER ||
    type === TransactionType.ASSIGN_NUTRITIONAL_PLAN_USER ||
    type === TransactionType.ASSIGN_PLAN_USER
  ) {
    return <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-500">Asignado</span>
  }
  if (
    type === TransactionType.UNASSIGN_ROUTINE_USER ||
    type === TransactionType.UNASSIGN_NUTRITIONAL_PLAN_USER ||
    type === TransactionType.UNASSIGN_PLAN_USER
  ) {
    return <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-500">Desasignado</span>
  }
  if (
    type === TransactionType.ROUTINE_CONVERTED_TO_PRESET ||
    type === TransactionType.NUTRITIONAL_PLAN_CONVERTED_TO_PRESET
  ) {
    return <span className="px-2 py-1 text-xs rounded-full bg-violet-500/20 text-violet-500">Convertido</span>
  }
  return <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-500">{type}</span>
}

