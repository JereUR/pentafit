"use client"

import { format, formatDistanceToNow, isWithinInterval, subDays } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, ClipboardList, Info, Share2, Users, SquareActivity, UserCheck } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PlanIcon } from "@/config/icons"
import noAvatarSrc from "@/assets/avatar-placeholder.png"
import { Transaction, TransactionType } from "@/types/transactions"
import { UserClient } from "@/types/user"

interface TransactionItemProps {
  transaction: Transaction
  isLast: boolean
  onShowFacilities: (facilities: Array<{ id: string; name: string; logoUrl?: string }>) => void
  onShowUsers: (users: UserClient[]) => void
}

interface AssignmentInfo {
  assignedCount: number
  alreadyAssignedCount: number
  assignedUsers: UserClient[]
}

export function TransactionItem({ transaction, isLast, onShowFacilities, onShowUsers }: TransactionItemProps) {
  const replicationInfo = getReplicationInfo(transaction)

  function getAssignmentInfo(transaction: Transaction): AssignmentInfo | null {
    if (transaction.type !== TransactionType.ASSIGN_ROUTINE_USER || !transaction.details) {
      return null
    }


    if (typeof transaction.details === "string") {
      try {
        const parsedDetails = JSON.parse(transaction.details)
        console.log("Parsed details:", parsedDetails)

        return {
          assignedCount: parsedDetails.assignedCount || 0,
          alreadyAssignedCount: parsedDetails.alreadyAssignedCount || 0,
          assignedUsers: parsedDetails.assignedUsers || [],
        }
      } catch (e) {
        console.error("Error parsing transaction details:", e)
        return null
      }
    }

    return {
      assignedCount: transaction.details.assignedCount || 0,
      alreadyAssignedCount: transaction.details.alreadyAssignedCount || 0,
      assignedUsers: transaction.details.assignedUsers || [],
    }
  }

  const assignmentInfo = getAssignmentInfo(transaction)

  return (
    <div>
      <div className="py-3">
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
          <div className="flex items-center col-span-1">
            {isUserTransaction(transaction.type) ? (
              <Avatar className="h-9 w-9 flex-shrink-0">
                <AvatarImage src={getTransactionAvatar(transaction)} alt="Avatar" />
                <AvatarFallback>{getTransactionInitials(transaction)}</AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <div className="h-4 w-4">{getTransactionIcon(transaction.type)}</div>
              </div>
            )}
            <div className="ml-4 space-y-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium leading-none truncate">{getTransactionName(transaction)}</p>

                {replicationInfo && (
                  <div className="flex items-center">
                    <Badge variant="outline" className="ml-2 flex items-center gap-1">
                      <Share2 className="h-3 w-3" />
                      <span>{replicationInfo.count}</span>
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-1"
                      onClick={() => onShowFacilities(replicationInfo.facilities)}
                    >
                      <Info className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}

                {assignmentInfo && (
                  <div className="flex items-center">
                    <Badge variant="outline" className="ml-2 flex items-center gap-1">
                      <UserCheck className="h-3 w-3" />
                      <span>{assignmentInfo.assignedCount}</span>
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-1"
                      onClick={() => onShowUsers(assignmentInfo.assignedUsers)}>
                      <Info className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">
                <span className="font-medium">{getTransactionType(transaction.type)}</span> - Por{" "}
                {transaction.performedBy.firstName} {transaction.performedBy.lastName}
              </p>
            </div>
          </div>
          <div className="flex items-center sm:justify-center">{getStatusBadge(transaction.type)}</div>
          <div className="flex items-center sm:justify-end">
            <div className="text-sm text-muted-foreground">{getFormattedDate(transaction.createdAt)}</div>
          </div>
        </div>
      </div>
      {!isLast && <Separator className="my-2" />}
    </div>
  )
}

function getTransactionIcon(type: TransactionType) {
  if (type.includes("ACTIVITY")) {
    return <ClipboardList className="h-4 w-4 text-purple-400" />
  }
  if (type.includes("STAFF") || type.includes("CLIENT")) {
    return <Users className="h-4 w-4 text-cyan-400" />
  }
  if (type.includes("PLAN")) {
    return <PlanIcon className="h-4 w-4 text-amber-400" />
  }
  if (type.includes("DIARY")) {
    return <Calendar className="h-4 w-4 text-emerald-400" />
  }
  if (type === TransactionType.ASSIGN_ROUTINE_USER) {
    return <UserCheck className="h-4 w-4 text-blue-400" />
  }
  if (type.includes("ROUTINE") && !type.includes("PRESET")) {
    return <SquareActivity className="h-4 w-4 text-lime-500" />
  }
  if (type.includes("PRESET_ROUTINE")) {
    return <SquareActivity className="h-4 w-4 text-indigo-500" />
  }
  return null
}

function getTransactionType(type: TransactionType) {
  if (type.includes("ACTIVITY")) return "Actividad"
  if (type.includes("STAFF")) return "Staff"
  if (type.includes("CLIENT")) return "Cliente"
  if (type.includes("PLAN")) return "Plan"
  if (type.includes("DIARY")) return "Diario"
  if (type === TransactionType.ASSIGN_ROUTINE_USER) return "Asignación de Rutina"
  if (type.startsWith("ROUTINE")) return "Rutina"
  if (type.startsWith("PRESET_ROUTINE")) return "Rutina preestablecida"
  return "N/A"
}

function getTransactionName(transaction: Transaction) {
  if (transaction.targetUser) {
    return `${transaction.targetUser.firstName} ${transaction.targetUser.lastName}`
  }
  if (transaction.activity) return transaction.activity.name
  if (transaction.plan) return transaction.plan.name
  if (transaction.diary) return transaction.diary.name
  if (transaction.routine) return transaction.routine.name
  if (transaction.presetRoutine) return transaction.presetRoutine.name

  if (transaction.details) {
    return transaction.details.attachmentName || transaction.details.replicatedName || "N/A"
  }
}

function getTransactionAvatar(transaction: Transaction) {
  if (transaction.targetUser?.avatarUrl) return transaction.targetUser.avatarUrl
  return noAvatarSrc.src
}

function getTransactionInitials(transaction: Transaction) {
  if (transaction.targetUser) {
    return `${transaction.targetUser.firstName[0]}${transaction.targetUser.lastName[0]}`
  }
  if (transaction.activity) return transaction.activity.name[0]
  if (transaction.plan) return transaction.plan.name[0]
  if (transaction.diary) return transaction.diary.name[0]
  if (transaction.routine) return transaction.routine.name[0]
  if (transaction.presetRoutine) return transaction.presetRoutine.name[0]
  return "?"
}

function getStatusBadge(type: TransactionType) {
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
  if (type === TransactionType.ASSIGN_ROUTINE_USER) {
    return <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-500">Asignado</span>
  }
  return <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-500">{type}</span>
}

function isUserTransaction(type: TransactionType) {
  return type.includes("STAFF") || type.includes("CLIENT")
}

function isReplicationTransaction(type: TransactionType) {
  return type.includes("REPLICATED")
}

function getReplicationInfo(transaction: Transaction) {
  if (!transaction.details || !isReplicationTransaction(transaction.type)) return null

  if (transaction.details.targetFacilities && Array.isArray(transaction.details.targetFacilities)) {
    return {
      count: transaction.details.targetFacilities.length,
      facilities: transaction.details.targetFacilities.map((facility) => ({
        id: facility.id,
        name: facility.name || facility.id,
        logoUrl: facility.logoUrl,
      })),
    }
  }

  if (transaction.details.targetFacilityId) {
    const facilityName = transaction.details.replicatedName || transaction.details.targetFacilityId

    return {
      count: 1,
      facilities: [
        {
          id: transaction.details.targetFacilityId,
          name: facilityName,
          logoUrl: undefined,
        },
      ],
    }
  }

  return null
}

function getFormattedDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const isRecent = isWithinInterval(date, {
    start: subDays(now, 1),
    end: now,
  })

  if (isRecent) {
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: es,
    })
  }

  return format(date, "dd.MM.yyyy HH:mm", { locale: es })
}
