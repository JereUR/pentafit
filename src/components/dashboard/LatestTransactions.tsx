"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, ClipboardList, Loader2, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLatestTransactions } from "@/hooks/useLatestTransactions"
import type { Transaction, TransactionType } from "@/types/transactions"
import noAvatarSrc from "@/assets/avatar-placeholder.png"
import { PlanIcon } from "@/config/icons"

interface LatestTransactionsProps {
  facilityId: string
}

interface TransactionDetails {
  attachmentName?: string
  [key: string]: string | undefined
}

type TransactionWithDetails = Transaction & {
  details?: TransactionDetails | null
}

export function LatestTransactions({ facilityId }: LatestTransactionsProps) {
  const { data: transactions, isLoading, error } = useLatestTransactions(facilityId)

  if (error) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Últimas Transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">Error al cargar las transacciones</p>
        </CardContent>
      </Card>
    )
  }

  const getTransactionIcon = (type: TransactionType) => {
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
    return null
  }

  const getTransactionType = (type: TransactionType) => {
    if (type.includes("ACTIVITY")) return "Actividad"
    if (type.includes("STAFF")) return "Staff"
    if (type.includes("CLIENT")) return "Cliente"
    if (type.includes("PLAN")) return "Plan"
    if (type.includes("DIARY")) return "Diario"
    return "N/A"
  }

  const getTransactionName = (transaction: TransactionWithDetails) => {
    if (transaction.targetUser) {
      return `${transaction.targetUser.firstName} ${transaction.targetUser.lastName}`
    }
    if (transaction.activity) return transaction.activity.name
    if (transaction.plan) return transaction.plan.name
    if (transaction.diary) return transaction.diary.name
    if (transaction.details?.attachmentName) return transaction.details.attachmentName
    return "N/A"
  }

  const getTransactionAvatar = (transaction: Transaction) => {
    if (transaction.targetUser?.avatarUrl) return transaction.targetUser.avatarUrl
    return noAvatarSrc.src
  }

  const getTransactionInitials = (transaction: Transaction) => {
    if (transaction.targetUser) {
      return `${transaction.targetUser.firstName[0]}${transaction.targetUser.lastName[0]}`
    }
    if (transaction.activity) return transaction.activity.name[0]
    if (transaction.plan) return transaction.plan.name[0]
    if (transaction.diary) return transaction.diary.name[0]
    return "?"
  }

  const getStatusBadge = (type: TransactionType) => {
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
    return <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-500">{type}</span>
  }

  const isUserTransaction = (type: TransactionType) => {
    return type.includes("STAFF") || type.includes("CLIENT")
  }

  return (
    <Card className="col-span-4 mt-6 border-primary">
      <CardHeader>
        <CardTitle>Últimas Transacciones</CardTitle>
        <CardDescription>Las últimas 10 operaciones realizadas</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : transactions && transactions.length > 0 ? (
          <div className="space-y-8">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center">
                {isUserTransaction(transaction.type) ? (
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={getTransactionAvatar(transaction)} alt="Avatar" />
                    <AvatarFallback>{getTransactionInitials(transaction)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
                    <div className="h-4 w-4">
                      {getTransactionIcon(transaction.type)}
                    </div>
                  </div>
                )}
                <div className="ml-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium leading-none">
                      {getTransactionName(transaction)}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">{getTransactionType(transaction.type)}</span> - Por{" "}
                    {transaction.performedBy.firstName} {transaction.performedBy.lastName}
                  </p>
                </div>
                <div className="ml-auto flex flex-col items-end gap-2">
                  <div>{getStatusBadge(transaction.type)}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(transaction.createdAt), "dd.MM.yyyy", { locale: es })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No hay transacciones recientes</p>
        )}
      </CardContent>
    </Card>
  )
}

